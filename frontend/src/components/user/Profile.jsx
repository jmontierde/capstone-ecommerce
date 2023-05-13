import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const Profile = () => { 

    const dispatch = useDispatch();
   
    const { user, loading, isAuthenticated} = useSelector(state => state.auth)

    console.log('PROFILE', isAuthenticated)


  return (
    <div className='container mx-auto py-6'>
        {/* User Profile */}
        <h1>My account</h1>
        <div className='flex'>
            <div className='flex gap-3 flex-col p-6 bg-[#9decec] w-1/5 h-auto'>
            <h2>My Account</h2>
            <Link className='flex'><img src="images/user.png" alt="personal" className='w-5 mr-2' /> Personal</Link>
            <Link className='flex'><img src="images/billing.png" alt="billing" className='w-5 mr-2'/> Billing</Link>
            <Link className='flex'><img src="images/setting.png" alt="settings" className='w-5 mr-2'/>Settings</Link>
            </div>
            {/* Personal Information */}
              <div className='bg-[#F5F7F9] flex flex-col p-6 w-4/5'>
                  <figure className='flex items-center '>
                      <img
                          src={user.avatar && user.avatar.url}
                          alt={user && user.name}
                          className='w-32 h-32 rounded-full'
                      />
                      <figcaption className='ml-6'>
                          <h2 className='font-semibold text-xl'>{user.name}</h2>
                          <p className='text-[#545556] font-light mb-2'>{user.email}</p>
                          <Link to='/me/update' className='border border-[#9b9999] text-center px-3 py-1 text-[#1e1e1e] font-medium'>Upload profile picture</Link>

                      </figcaption>
                  </figure>
                  <div className='flex flex-col gap-3'>

                      <h4 className='font-semibold mt-6'>Personal</h4>
                      <hr />
                      <h5>Full name</h5>
                      <input
                                type="name"
                                id="name_field"
                                name='name'
                            />
                      <h5>Email</h5>
                      <input
                            type="email"
                            id="email_field"
                            name='email'
                        />
                  </div>
              </div>
        </div>
    </div>
  )
}

export default Profile