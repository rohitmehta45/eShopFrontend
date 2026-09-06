import { useEffect, useState } from 'react';
import { customerApi } from '../services/api';
import PreviouslyPurchased from '../components/products/PreviouslyPurchased';
import UserAvatar from '../components/layout/UserAvatar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AccountNav from '../components/layout/AccountNav';

const blankAddress = { label: 'Home', fullName: '', phone: '', street: '', area: '', city: '', state: '', ward: '', zipCode: '', country: 'USA' };
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', profileImage: '' });
  const [preview, setPreview] = useState('');
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
 const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(blankAddress);
  useEffect(() => {
    Promise.all([customerApi.getProfile(), customerApi.getAddresses()]).then(([p, a]) => {
      setProfile(p.data.user);
      setAddresses(a.data.addresses || []);
    }).catch(() => toast.error('Failed to load profile'));
  }, []);
  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      const { data } = await customerApi.updateProfile(profile);
      setProfile(data.user);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
  };
  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) return toast.error('Use JPG, PNG, or WEBP up to 2MB');
    setPreview(URL.createObjectURL(file));
    try {
      const { data } = await customerApi.uploadProfileImage(file);
      setProfile((current) => ({ ...current, profileImage: data.profileImage }));
      updateUser({ profileImage: data.profileImage });
      toast.success('Profile image updated');
    } catch {
      setPreview('');
      toast.error('Failed to upload profile image');
    }
  };
  const removeImage = async () => {
    try {
      await customerApi.removeProfileImage();
      setProfile((current) => ({ ...current, profileImage: '' }));
      setPreview('');
      updateUser({ profileImage: '' });
      toast.success('Profile image removed');
    } catch { toast.error('Failed to remove profile image'); }
  };
  const savePassword = async (event) => {
    event.preventDefault();
    try {
      await customerApi.changePassword(password);
      setPassword({ currentPassword: '', newPassword: '' });
      toast.success('Password updated');
    } catch (error) { toast.error(error.response?.data?.error || 'Failed to update password'); }
  };
  const addAddress = async (event) => {
    event.preventDefault();
    try {
      const { data } = await customerApi.addAddress(address);
      setAddresses(data.addresses);
      setAddress(blankAddress);
      toast.success('Address saved');
    } catch { toast.error('Failed to save address'); }
  };
  const removeAddress = async (id) => {
    try {
      const { data } = await customerApi.removeAddress(id);
      setAddresses(data.addresses);
    } catch { toast.error('Failed to remove address'); }
  };

  const avatarUser = { ...user, ...profile, profileImage: preview || profile.profileImage };
  
  return (
    <div className="container-custom grid gap-8 py-10 lg:grid-cols-[240px_minmax(0,1fr)]">
      <AccountNav />
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Account</p>
          <h1 className="font-display mt-2 text-4xl">My account</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={saveProfile} className="card space-y-4 p-6">
            <h2 className="text-lg font-semibold">Personal information</h2>
            <div className="flex items-center gap-4">
              <UserAvatar user={avatarUser} className="h-20 w-20" />
              <label className="btn-secondary cursor-pointer">Change photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} className="hidden" /></label>
              {profile.profileImage && <button type="button" onClick={removeImage} className="text-sm text-danger">Remove</button>}
            </div>
            <label className="text-sm font-medium">Name<input required className="admin-input" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
            <label className="text-sm font-medium">Email<input required type="email" className="admin-input" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label>
            <label className="text-sm font-medium">Phone<input className="admin-input" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label>
            <button className="btn-primary">Save profile</button>
          </form>
          <form onSubmit={savePassword} className="card space-y-4 p-6">
            <h2 className="text-lg font-semibold">Security</h2>
            <label className="text-sm font-medium">Current password<input required type="password" autoComplete="current-password" className="admin-input" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} /></label>
            <label className="text-sm font-medium">New password<input required minLength="6" type="password" autoComplete="new-password" className="admin-input" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} /></label>
            <button className="btn-primary">Update password</button>
          </form>
        </div>
        <section className="card p-6">
          <h2 className="text-lg font-semibold">Previously purchased</h2>
          <div className="mt-5"><PreviouslyPurchased /></div>
        </section>
        <section className="card p-6">
          <h2 className="text-lg font-semibold">Saved addresses</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {addresses.map((item) => (
              <div className="rounded-[14px] bg-ivory p-4" key={item._id}>
                <div className="flex justify-between"><b>{item.label}</b><button type="button" onClick={() => removeAddress(item._id)} className="text-sm text-danger">Remove</button></div>
                <p className="mt-2 text-sm text-mocha">{item.street}, {item.area}, {item.city}, {item.state} Ward {item.ward} {item.zipCode}</p>
              </div>
            ))}
          </div>
          <form onSubmit={addAddress} className="mt-6 grid gap-3 sm:grid-cols-2">
            {[['label', 'Label'], ['fullName', 'Full name'], ['phone', 'Phone'], ['street', 'Address'], ['area', 'Area / Tole'], ['city', 'City / Municipality'], ['state', 'Province / State'], ['ward', 'Ward number'], ['zipCode', 'Postal code'], ['country', 'Country']].map(([key, placeholder]) => (
              <input required={['fullName', 'phone', 'street', 'area', 'city', 'state', 'ward'].includes(key)} key={key} placeholder={placeholder} className="admin-input" value={address[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} />
            ))}
            <button className="btn-primary sm:col-span-2">Add address</button>
          </form>
        </section>
      </div>
    </div>
  );
}
