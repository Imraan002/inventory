import { EditFilled, EditOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row } from 'antd';
import userProPic from '../assets/User.png';
import Loader from '../components/Loader';
import { useGetSelfProfileQuery } from '../redux/features/authApi';
import { profileKeys } from '../constant/profile';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { data, isLoading } = useGetSelfProfileQuery(undefined);

  if (isLoading) return <Loader />;

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(to right, rgba(4, 30, 66, 0.85), rgba(23, 83, 122, 0.75)), url("/bg-profile.jpg") center center / cover no-repeat',
        padding: '2rem',
      }}
    >
      <Flex vertical style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <Flex justify="center" style={{ width: '100%' }}>
          <Flex
            justify="center"
            style={{
              width: '250px',
              height: '250px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              padding: '.5rem',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <img
              src={data?.data?.avatar || userProPic}
              alt="user"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          </Flex>
        </Flex>

        <Flex justify="center" style={{ margin: '1rem' }}>
          <Flex gap={16} wrap="wrap" justify="center">
            <Link to="/edit-profile">
              <Button
                type="primary"
                style={{
                  backgroundColor: '#164863',
                  borderColor: '#164863',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                }}
              >
                <EditOutlined />
                Edit Profile
              </Button>
            </Link>
            <Link to="/change-password">
              <Button
                type="primary"
                style={{
                  backgroundColor: '#164863',
                  borderColor: '#164863',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                }}
              >
                <EditFilled />
                Change Password
              </Button>
            </Link>
          </Flex>
        </Flex>

        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 4 }}></Col>
          <Col
            xs={{ span: 24 }}
            lg={{ span: 16 }}
            style={{
              maxWidth: '700px',
              padding: '2rem',
              borderRadius: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {profileKeys.map((key) => (
              <ProfileInfoItems
                key={key.keyName}
                keyName={key.keyName}
                value={data?.data[key.keyName]}
              />
            ))}
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 4 }}></Col>
        </Row>
      </Flex>
    </div>
  );
};

export default ProfilePage;

const ProfileInfoItems = ({ keyName, value }: { keyName: string; value: string }) => {
  return (
    <Flex style={{ width: '100%' }} gap={24}>
      <h2
        style={{
          flex: 1,
          fontWeight: '700',
          textTransform: 'capitalize',
          color: '#fff',
        }}
      >
        {keyName}
      </h2>
      <h3
        style={{
          flex: 4,
          fontWeight: '500',
          color: '#ccc',
        }}
      >
        {value}
      </h3>
    </Flex>
  );
};
