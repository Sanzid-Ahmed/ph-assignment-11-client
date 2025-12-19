import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaUserFriends, FaBuilding, FaBirthdayCake, FaChevronDown } from "react-icons/fa";
import MyTeamEachMember from "./MyTeamEachMember";

const MyTeam = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedHrEmail, setSelectedHrEmail] = useState(null);
  const [userDetailsArray, setUserDetailsArray] = useState([]);

  const handleUserData = (userData) => {
  setUserDetailsArray((prev) => {
    // Avoid duplicates
    if (!prev.find((u) => u.employeeEmail === userData.employeeEmail)) {
      return [...prev, userData];
    }
    return prev;
  });
};


  const { data: affiliations = [] } = useQuery({
    queryKey: ["employee-company", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/employee/company/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (affiliations.length > 0 && !selectedHrEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedHrEmail(affiliations[0].hrEmail);
    }
  }, [affiliations]);

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["employees", selectedHrEmail],
    queryFn: async () => {
      if (!selectedHrEmail) return [];
      const res = await axiosSecure.get(`/employees/${selectedHrEmail}`);
      return res.data;
    },
    enabled: !!selectedHrEmail,
  });

  // --- Logic for Next Upcoming Birthday ---
const upcomingBirthdayMember = React.useMemo(() => {
  if (!userDetailsArray || userDetailsArray.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset time for comparison

  return userDetailsArray
    .filter(user => user.dateOfBirth) // only users with birthdays
    .map(user => {
      const dob = new Date(user.dateOfBirth);
      let nextBDay = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

      // If birthday already passed this year, consider next year
      if (nextBDay < today) {
        nextBDay.setFullYear(today.getFullYear() + 1);
      }

      return { ...user, nextBDayDate: nextBDay };
    })
    .sort((a, b) => a.nextBDayDate - b.nextBDayDate)[0]; // earliest upcoming
}, [userDetailsArray]);

  if (affiliations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-base-200 p-10 rounded-[3rem] shadow-inner max-w-md">
          <FaUserFriends className="text-6xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-neutral mb-2">No Team Found</h2>
          <p className="text-gray-500">
            You are not currently affiliated with any company. Join a team by requesting your first asset.
          </p>
        </div>
      </div>
    );
  }

  const activeCompany = affiliations.find(a => a.hrEmail === selectedHrEmail);

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      {/* Company Selection Dropdown */}
      <div className="flex justify-between items-center bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200">
        <div className="hidden md:block">
          <h1 className="text-xl font-bold">My Team</h1>
          <p className="text-xs text-gray-500">Browse colleagues across your affiliated companies</p>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-outline btn-primary rounded-xl gap-2">
            <FaBuilding /> {activeCompany?.companyName || "Select Company"} <FaChevronDown className="text-xs" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-100 rounded-box w-64 mt-2 border border-base-200">
            {affiliations.map((aff) => (
              <li key={aff._id}>
                <button 
                  onClick={() => setSelectedHrEmail(aff.hrEmail)}
                  className={`${selectedHrEmail === aff.hrEmail ? 'active' : ''}`}
                >
                  {aff.companyName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex items-center gap-6 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] p-8 text-white shadow-lg">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md hidden sm:block">
            <FaBuilding className="text-4xl" />
          </div>
          <div>
            <h2 className="text-3xl font-black">{activeCompany?.companyName}</h2>
            <p className="opacity-90">Team Portal • Read-only Access</p>
          </div>
        </div>
        <div className="bg-base-100 border border-base-200 rounded-[2rem] p-8 flex flex-col justify-center items-center shadow-sm">
          <div className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">Total Members</div>
          <div className="text-5xl font-black text-primary">{teamMembers.length}</div>
        </div>
      </div>

      {/* Next Upcoming Birthday Section */}
{upcomingBirthdayMember && (
  <div className="bg-secondary/5 border-2 border-dashed border-secondary/20 rounded-[2rem] p-6">
    <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
      <FaBirthdayCake className="animate-bounce" /> Next Upcoming Birthday
    </h3>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-white p-4 pr-8 rounded-full shadow-md border border-secondary/20">
        <div className="avatar online">
          <div className="w-12 h-12 rounded-full bg-secondary text-secondary-content flex items-center justify-center overflow-hidden">
            {upcomingBirthdayMember.profileImage ? (
              <img src={upcomingBirthdayMember.profileImage} alt={upcomingBirthdayMember.name} />
            ) : (
              <span className="text-lg font-bold">
                {upcomingBirthdayMember.name?.charAt(0)}
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-md font-black leading-none">{upcomingBirthdayMember.name}</p>
          <p className="text-xs text-secondary font-bold mt-1">
            {upcomingBirthdayMember.nextBDayDate.toLocaleDateString('default', { 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Colleagues Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FaUserFriends className="text-primary" /> Team Directory
            </h3>
            <span className="badge badge-ghost font-medium">Read-Only</span>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-base-200 animate-pulse rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <MyTeamEachMember key={member._id} member={member} onUserData={handleUserData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeam;