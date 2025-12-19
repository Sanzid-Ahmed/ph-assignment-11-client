import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaUserTie, FaBuilding, FaUserFriends, FaEnvelope } from "react-icons/fa";

const MyTeam = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch team members based on the current user's affiliated company (HR email)
  const { data: team = [], isLoading } = useQuery({
    queryKey: ["my-team", user?.hrEmail],
    enabled: !!user?.companyName, // Only run if user is affiliated
    queryFn: async () => {
      const res = await axiosSecure.get(`/team/${user?.hrEmail}`);
      return res.data;
    },
  });

  if (!user?.companyName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-base-200 p-10 rounded-[3rem] shadow-inner max-w-md">
          <FaUserFriends className="text-6xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-neutral mb-2">No Team Found</h2>
          <p className="text-gray-500 mb-6">
            You are not currently affiliated with any company. Join a team by requesting your first asset.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-primary rounded-[2rem] p-8 text-primary-content shadow-xl shadow-primary/20">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
            <FaBuilding className="text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-black">{user?.companyName}</h2>
            <p className="opacity-80 font-medium">Official Team Directory</p>
          </div>
        </div>
        <div className="stats bg-transparent text-primary-content">
          <div className="stat px-0 md:px-6">
            <div className="stat-title text-primary-content opacity-70">Team Size</div>
            <div className="stat-value text-4xl">{team.length}</div>
            <div className="stat-desc text-primary-content opacity-70 text-xs font-bold uppercase tracking-widest mt-1">Active Members</div>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div>
        <h3 className="text-xl font-bold text-neutral mb-6 flex items-center gap-2">
          <FaUserFriends className="text-primary" /> Meet Your Colleagues
        </h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-base-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div 
                key={member._id} 
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 rounded-3xl group"
              >
                <div className="card-body p-6 flex-row items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-2xl ring ring-primary/10 ring-offset-base-100 group-hover:ring-primary transition-all">
                      <img 
                        src={member.profileImage || member.photoURL || "https://i.ibb.co.com/mR7093X/user-placeholder.png"} 
                        alt={member.name} 
                      />
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-black text-neutral text-lg truncate">{member.name}</h4>
                    <p className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
                       <FaUserTie className="text-primary/60" /> 
                       {member.role === 'hr' ? 'HR Manager' : 'Employee'}
                    </p>
                    <p className="flex items-center gap-2 text-[11px] text-gray-400 truncate">
                       <FaEnvelope /> {member.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center opacity-50 text-xs font-medium py-10 uppercase tracking-widest">
        End of Directory
      </div>
    </div>
  );
};

export default MyTeam;