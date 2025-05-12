import { Button, Flex } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../redux/features/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/services/authSlice';
import decodeToken from '../../utils/decodeToken';
import { toast } from 'sonner';
import toastMessage from '../../lib/toastMessage';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userRegistration] = useRegisterMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading('Registering new account!');
    if (data.password !== data.confirmPassword) {
      toast.dismiss(toastId);
      toastMessage({ icon: 'error', text: 'Password and confirm password must be same!' });
      return;
    }

    try {
      const res = await userRegistration(data).unwrap();
      if (res.statusCode === 201) {
        const user = decodeToken(res.data.token);
        dispatch(loginUser({ token: res.data.token, user }));
        navigate('/');
        toast.success(res.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.data.message || 'Something went wrong!', { id: toastId });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: `linear-gradient(to right, rgba(4, 30, 66, 0.85), rgba(23, 83, 122, 0.75)), url('/bg-inventory.jpg') center center / cover no-repeat`,
      }}
    >
      {/* Left - 70% Form Centered */}
      <div
        style={{
          flex: 7,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '3rem 2.5rem',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            color: '#fff',
          }}
        >
          <h1 style={{ textAlign: 'center', marginBottom: '0.3rem', fontSize: '28px' }}>Create Account</h1>
          <p style={{ textAlign: 'center', fontSize: '14px', marginBottom: '1.8rem', opacity: 0.8 }}>
            Join our inventory system and simplify your workflow.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <input
              type='text'
              {...register('name', { required: true })}
              placeholder='Your Name'
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                fontSize: '15px',
              }}
            />
            <input
              type='email'
              {...register('email', { required: true })}
              placeholder='Email Address'
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                fontSize: '15px',
              }}
            />
            <input
              type='password'
              {...register('password', { required: true })}
              placeholder='Password'
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                fontSize: '15px',
              }}
            />
            <input
              type='password'
              {...register('confirmPassword', { required: true })}
              placeholder='Confirm Password'
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                fontSize: '15px',
              }}
            />

            <Button
              htmlType='submit'
              type='primary'
              block
              style={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '16px',
                padding: '12px 0',
                background: 'linear-gradient(to right, #1677ff, #65bfff)',
                borderRadius: '10px',
                border: 'none',
              }}
            >
              Register
            </Button>
          </form>

          <p style={{ marginTop: '1.7rem', textAlign: 'center', fontSize: '13px', opacity: 0.9 }}>
            Already have an account?{' '}
            <Link to='/login' style={{ color: '#fff', textDecoration: 'underline' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Right - 30% Info Panel */}
      <div
        style={{
          flex: 3,
          color: '#fff',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.25)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', marginBottom: '1rem', lineHeight: '1.4' }}>
            Welcome to <span style={{ color: '#65bfff' }}>Shelf</span>
          </h1>
          <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '1.2rem', opacity: 0.9 }}>
            Manage inventory, track products, and run your business more efficiently with our modern
            platform.
          </p>
          <ul style={{ fontSize: '13px', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>🗃️ Easy stock control</li>
            <li>📦 Smart order processing</li>
            <li>📊 Real-time reporting</li>
            <li>👥 Role-based access</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
