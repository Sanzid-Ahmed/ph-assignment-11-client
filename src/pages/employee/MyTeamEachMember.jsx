import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { FaEnvelope, FaUserTie } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const MyTeamEachMember = ({member, onUserData}) => {
    console.log("Member 1", member.employeeEmail)

    
    const axiosSecure = useAxiosSecure();

    const { data: userData = [] } = useQuery({
        queryKey: ['user-data', member?.employeeEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${member.employeeEmail}`);
            return res.data;
        },
        enabled: !!member?.employeeEmail,
    });
  console.log("Member => ", userData)

  useEffect(() => {
  if (userData && Object.keys(userData).length > 0) {
    onUserData(userData); // <-- send data to parent
  }
}, [userData]);
    return (
        <div>
            <div 
                key={member._id} 
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 rounded-3xl group"
              >
                <div className="card-body p-6 flex-row items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-2xl ring ring-primary/10 ring-offset-base-100 group-hover:ring-primary transition-all">
                      <img 
                        src={userData.profileImage || userData.photoURL || "https://i.ibb.co.com/mR7093X/user-placeholder.png"} 
                        alt={userData.employeeName} 
                      />
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-black text-neutral text-lg truncate">{userData.name}</h4>
                    <p className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
                       <FaUserTie className="text-primary/60" /> 
                       {member.role === 'hr' ? 'HR Manager' : 'Employee'}
                    </p>
                    <p className="flex items-center gap-2 text-[11px] text-gray-400 truncate">
                       <FaEnvelope /> {userData.email}
                    </p>
                  </div>
                </div>
              </div>
        </div>
    );
};

export default MyTeamEachMember;