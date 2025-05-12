import { Button, Flex } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLoginMutation } from '../../redux/features/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/services/authSlice';
import decodeToken from '../../utils/decodeToken';

const LoginPage = () => {
  const [userLogin] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading('Logging in...');
    try {
      const res = await userLogin(data).unwrap();

      if (res.statusCode === 200) {
        const user = decodeToken(res.data.token);
        dispatch(loginUser({ token: res.data.token, user }));
        navigate('/');
        toast.success('Successfully Logged In!', { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.data.message, { id: toastId });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: `linear-gradient(to right, rgba(4, 30, 66, 0.8), rgba(23, 83, 122, 0.7)), url('/bg-inventory.jpg') center center / cover no-repeat`,
      }}
    >
      {/* Left - Centered Login */}
      <div
        style={{
          flex: 1,
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
          <h1 style={{ textAlign: 'center', marginBottom: '0.3rem', fontSize: '28px' }}>Welcome Back</h1>
          <p style={{ textAlign: 'center', fontSize: '14px', marginBottom: '1.8rem', opacity: 0.8 }}>
            Sign in to manage your inventory like a pro.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
            <input
              type='text'
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
              Login
            </Button>
          </form>

          <p style={{ marginTop: '1.7rem', textAlign: 'center', fontSize: '13px', opacity: 0.9 }}>
            Don’t have an account?{' '}
            <Link to='/register' style={{ color: '#fff', textDecoration: 'underline' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right - App Description */}
      <div
        style={{
          flex: 1,
          color: '#fff',
          padding: '4rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '1rem', lineHeight: '1.3' }}>
            <span style={{ color: '#65bfff' }}>Shelf</span> — Your Smart Inventory Assistant
          </h1>
          <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '1.5rem', opacity: 0.9 }}>
            Streamline your stock, orders, and reports effortlessly. A complete suite designed for retailers,
            wholesalers, and admins to work in sync.
          </p>
          <ul style={{ fontSize: '15px', paddingLeft: '1.2rem', lineHeight: '1.8' }}>
            <li>📦 Real-time stock tracking & alerts</li>
            <li>📈 Analytics-driven insights</li>
            <li>🤝 Seamless supplier-retailer coordination</li>
            <li>🛍️ Smooth bulk order management</li>
          </ul>
          <p style={{ marginTop: '2rem', fontStyle: 'italic', fontSize: '14px', opacity: 0.8 }}>
            Join thousands of businesses simplifying their inventory today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
