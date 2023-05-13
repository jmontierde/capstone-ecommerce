import React, {  useState, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, loadUser, clearErrors } from '../../actions/userActions'
import { UPDATE_PROFILE_RESET } from '../../constants/userConstant'
import { useNavigate } from 'react-router-dom'

const UpdateProfile = () => {

    const { isAuthenticated, user } = useSelector(state => state.auth)
    const { error, isUpdated, loading } = useSelector(state => state.user)

    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();
  
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')

    console.log('Auth', isUpdated)
    
       useEffect(() => {

        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url)
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success('User updated successfully')
            dispatch(loadUser());

            navigate('/me')

            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }

    }, [dispatch, alert, error,  isUpdated])


    const submitHandler = (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.set('name', name);
      formData.set('email', email);
      formData.set('avatar', avatar);

      dispatch(updateProfile(formData))
  }

  const onChange = e => {
      const reader = new FileReader();

      reader.onload = () => {
          if (reader.readyState === 2) {
              setAvatarPreview(reader.result)
              setAvatar(reader.result)
          }
      }

      reader.readAsDataURL(e.target.files[0])

  }

  return (
    <div className='flex flex-col'>
      <h1>Hello</h1>

      <form onSubmit={submitHandler} encType='multipart/form-data'>
        <label htmlFor="email_field">Name</label>
        <input
            type="name"
            id="name_field"
            className="form-control"
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email_field">Email</label>
        <input
            type="email"
            id="email_field"
            className="form-control"
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
{/* 
        <figure className='flex items-center '>
            <img
                src={user.avatar && user.avatar.url}
                alt={user && user.name}
                className='w-24 h-24 rounded-full'
            />
            <figcaption className='ml-6'>
                <h2 className='font-semibold text-xl'>{user.name}</h2>
                <p className='text-[#545556] font-light mb-2'>{user.email}</p>

            </figcaption>
        </figure> */}
        <div className='form-group'>
            <label htmlFor='avatar_upload'>Avatar</label>
            <div className='d-flex align-items-center'>
                <div>
                    <figure className='avatar mr-3 item-rtl'>
                        <img
                            src={avatarPreview}
                            className='rounded w-24'
                            alt='Avatar Preview'
                        />
                    </figure>
                </div>
                <div className='custom-file'>
                    <input
                        type='file'
                        name='avatar'
                        className='custom-file-input'
                        id='customFile'
                        accept='image/*'
                        onChange={onChange}
                    />
                    <label className='custom-file-label' htmlFor='customFile'>
                        Choose Avatar
                </label>
                </div>
            </div>
        </div>


        <button>Update</button>
      </form>
    </div>
  )
}

export default UpdateProfile