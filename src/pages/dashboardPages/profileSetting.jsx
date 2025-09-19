import { useEffect, useState } from 'react';
import { 
  Button, 
  TextInput, 
  Loader, 
  Divider, 
  Avatar, 
  Group, 
  Text, 
  Stack,
  Paper,
  Grid,
  FileButton,
  ActionIcon,
  Select,
  Textarea,
  Flex
} from '@mantine/core';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { SquarePen, Save, X, Upload, User } from 'lucide-react';
import custAxios, { attachToken, attachTokenWithFormAxios, formAxios } from '../../configs/axios.config';
import { notifications } from '@mantine/notifications';
import { userGetData } from '../../services/hooks';
import { useGetUserProfile } from '../../hooks/useGetUserProfile';
import { errorMessage, successMessage } from '../../lib/toast';

const ProfileSettings = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    profileImage: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const { data } = useGetUserProfile();
  console.log(data , "me data");
  
const userData = userGetData()
  // Fetch user profile
  const { data: userProfile, isPending: isLoadingProfile, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      attachToken();
      const response = await custAxios.get('/auth/me');
      return response.data;
    },
    retry: 2
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (data?.data?.data) {
      setFormValues({
        name: data?.data?.data?.name || '',
        email: data?.data?.data?.email || '',
        phone: data?.data?.data?.phone || '',
        address: data?.data?.data?.address || '',
        bio: data?.data?.data?.bio || '',
        profileImage: data?.data?.data?.profileImage || ''
      });
    }
  }, [data?.data?.data]);

  const validate = () => {
    const errors = {};
    if (!formValues.name?.trim()) errors.name = 'Name is required';
    if (!formValues.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (formValues.phone && !/^\+?[\d\s\-\(\)]+$/.test(formValues.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    if (userProfile) {
      setFormValues({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        bio: userProfile.bio || '',
        profileImage: userProfile.profileImage || ''
      });
    }
    setFormErrors({});
    setAvatarFile(null);
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(payload).forEach(key => {
        if (key !== 'profileImage' && payload[key]) {
          formData.append(key, payload[key]);
        }
      });
      
      // Append avatar file if selected
      if (avatarFile) {
        formData.append('profileImage', avatarFile);
      }
      attachTokenWithFormAxios()
      const response = await formAxios.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setIsEditing(false);
      setAvatarFile(null);
     successMessage("Profile Updated Successfully")
    },
    onError: (error) => {
        errorMessage( error.response?.data?.message || 'Failed to update profile')
     
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    setFormErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  const handleSave = () => {
    if (!validate()) return;
    
    updateProfileMutation.mutate({
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone?.trim() || '',
      address: formValues.address?.trim() || '',
      bio: formValues.bio?.trim() || ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isBusy = isLoadingProfile || updateProfileMutation.isPending;

  if (error) {
    return (
      <div className="py-5 px-20 rounded-lg">
        <div className="text-center mt-16">
          <Text size="lg" c="red">Failed to load profile</Text>
          <Text size="sm" c="dimmed">Please try refreshing the page</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 md:px-20 px-2 rounded-lg">
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-3xl mb-1'>Profile Settings</p>
          <p className='text-sm text-slate-500'>Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button 
            onClick={handleEdit} 
            leftSection={<SquarePen size={16}/>} 
            className='!bg-hollywood-700 !text-white !rounded-lg'
            disabled={isBusy}
          >
            Edit Profile
          </Button>
        ) : (
          <Group gap="sm">
            <Button 
              variant='default' 
              onClick={handleCancel}
              leftSection={<X size={16}/>}
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              leftSection={<Save size={16}/>}
              className='!bg-hollywood-700 !text-white !rounded-lg'
              loading={updateProfileMutation.isPending}
            >
              Save Changes
            </Button>
          </Group>
        )}
      </div>
      <Divider my={20}/>

      <Paper className='bg-white p-6 rounded-lg shadow-lg' radius="md">
        {isBusy && !isEditing ? (
          <div className='my-16 flex justify-center'>
            <Loader color="#255b7f"/>
          </div>
        ) : (
          <div className='flex gap-xl flex-wrap md:flex-nowrap'>
            {/* Avatar Section */}
            <div className='text-md xl:min-w-[300px] text-slate-600 flex items-center flex-col'>
            <Group gap="lg" align="flex-start">
              <div className="relative flex flex-col justify-center items-center">
                <Avatar
                  size={120}
                  src={avatarFile ? URL.createObjectURL(avatarFile) : formValues.profileImage}
                  alt="Profile Avatar"
                  className="border-4 border-gray-100"
                >
                  <User size={48} />
                </Avatar>
                {isEditing && (
                  <FileButton
                    onChange={setAvatarFile}
                    accept="image/png,image/jpeg,image/jpg"
                  >
                    {(props) => (
                    //   <ActionIcon
                    //     {...props}
                    //     className="absolute -bottom-2 -right-2 !bg-hollywood-700 !text-white"
                    //     size="lg"
                    //     radius="xl"
                    //   >
                    <Button {...props} className="absolute -bottom-2 -right-2 !bg-hollywood-700 !text-white"
                    >

                        <Upload size={16} className='me-4'/> Upload Image
                    </Button>
                    //   </ActionIcon>
                    )}
                  </FileButton>
                )}
              </div>
              {/* <Stack gap="xs" className="flex-1">
                <Text size="xl" fw={600}>
                  {formValues.firstName} {formValues.lastName}
                </Text>
                <Text size="sm" c="dimmed">{formValues.email}</Text>
                {formValues.bio && (
                  <Text size="sm" c="dimmed" className="max-w-md">
                    {formValues.bio}
                  </Text>
                )}
                {avatarFile && (
                  <Text size="xs" c="blue">
                    New avatar selected: {avatarFile.name}
                  </Text>
                )}
              </Stack> */}
            </Group>
<div className='border-t-2 border-slate-200 mt-10 flex flex-col gap-4 pt-10'>


<p>Name : {formValues?.name}</p>
<p>Email : {formValues?.email}</p>
<p>Phone : {formValues?.phone}</p>
</div>

            </div>


            {/* <Divider /> */}

            {/* Form Fields */}
            <Grid>
              <Grid.Col span={{ base: 12 }}>
                <TextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formValues.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={formErrors.name}
                  required
                  disabled={!isEditing}
                />
              </Grid.Col>
             
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  value={formValues.email}
                //   onChange={(e) => handleInputChange('email', e.target.value)}
                  error={formErrors.email}
                  required
                  disabled={true}
                  type="email"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Phone"
                  placeholder="Enter your phone number"
                  value={formValues.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={formErrors.phone}
                  disabled={!isEditing}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Address"
                  placeholder="Enter your address"
                  value={formValues.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={formErrors.address}
                  disabled={!isEditing}
                />
              </Grid.Col>
            
              <Grid.Col span={12}>
                <Textarea
                  label="Bio"
                  placeholder="Tell us about yourself"
                  value={formValues.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  error={formErrors.bio}
                  disabled={!isEditing}
                  rows={3}
                  maxLength={500}
                />
              </Grid.Col>
            </Grid>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default ProfileSettings;