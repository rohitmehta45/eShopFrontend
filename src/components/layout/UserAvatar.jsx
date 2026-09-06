import { useEffect, useState } from 'react';

const getAvatarInitial = (name) => name?.trim()?.charAt(0)?.toUpperCase() || '?';
const getImageUrl = (profileImage) => {
  const value = typeof profileImage === 'object' ? profileImage?.url : profileImage;
  if (!value) return '';
  return value.startsWith('http') || value.startsWith('blob:') || value.startsWith('data:') ? value : `${import.meta.env.VITE_API_ORIGIN || 'http://localhost:5000'}${value}`;
};

export default function UserAvatar({ user, className = 'h-8 w-8', alt }) {
  const imageUrl = getImageUrl(user?.profileImage);
  const [imageFailed, setImageFailed] = useState(false);
  const accessibleAlt = alt || `${user?.name || 'User'} profile image`;
  useEffect(() => setImageFailed(false), [imageUrl]);
  if (imageUrl && !imageFailed) return <img src={imageUrl} alt={accessibleAlt} className={`${className} rounded-full object-cover`} onError={() => setImageFailed(true)} />;
  return <span className={`${className} flex items-center justify-center rounded-full bg-ivory font-semibold text-espresso`} aria-label={`${getAvatarInitial(user?.name)} avatar`}>{getAvatarInitial(user?.name)}</span>;
}

export { getAvatarInitial };
