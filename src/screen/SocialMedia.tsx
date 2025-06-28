import { useState } from 'react';

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  placeholder: string;
  checked: boolean;
  url: string;
  bgColor: string;
}

const SocialMedia = () => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    {
      id: 'instagram',
      name: 'Instagram',
      icon: "/images/media/1.png",
      placeholder: 'https://www.instagram.com/username',
      checked: true,
      url: 'https://www.instagram.com/aljazeera/',
      bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: "/images/media/2.png",
      placeholder: 'https://www.tiktok.com/@username',
      checked: false,
      url: '',
      bgColor: 'bg-black'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: "/images/media/3.png",
      placeholder: 'https://www.facebook.com/username',
      checked: true,
      url: '',
      bgColor: 'bg-blue-600'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: "/images/media/4.png",
      placeholder: 'https://www.youtube.com/channel/username',
      checked: true,
      url: '',
      bgColor: 'bg-red-600'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: "/images/media/5.png",
      placeholder: 'https://twitter.com/username',
      checked: false,
      url: '',
      bgColor: 'bg-sky-500'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: "/images/media/6.png",
      placeholder: 'https://wa.me/1234567890',
      checked: false,
      url: '',
      bgColor: 'bg-green-500'
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: "/images/media/7.png",
      placeholder: 'https://pinterest.com/username',
      checked: false,
      url: '',
      bgColor: 'bg-red-700'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: "/images/media/8.png",
      placeholder: 'https://linkedin.com/in/username',
      checked: false,
      url: '',
      bgColor: 'bg-blue-700'
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: "/images/media/9.png",
      placeholder: 'https://snapchat.com/add/username',
      checked: true,
      url: '',
      bgColor: 'bg-yellow-400'
    },
    {
      id: 'fiverr',
      name: 'Fiverr',
      icon: "/images/media/11.png",
      placeholder: 'https://fiverr.com/username',
      checked: true,
      url: '',
      bgColor: 'bg-green-500'
    },
    {
      id: 'email',
      name: 'Email',
      icon: "/images/media/12.png",
      placeholder: 'mailto:example@email.com',
      checked: false,
      url: '',
      bgColor: 'bg-gray-600'
    },
    {
      id: 'phone',
      name: 'Phone',
      icon: "/images/media/13.png",
      placeholder: '+1234567890',
      checked: true,
      url: '',
      bgColor: 'bg-blue-500'
    },
    {
      id: 'location',
      name: 'Location',
      icon: "/images/media/14.png",
      placeholder: 'Address or Google Maps link',
      checked: false,
      url: '',
      bgColor: 'bg-red-500'
    }
  ]);

  const toggleCheckbox = (id: string) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === id 
          ? { ...platform, checked: !platform.checked }
          : platform
      )
    );
  };

  const updateUrl = (id: string, url: string) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === id 
          ? { ...platform, url, checked: url.trim() ? true : platform.checked }
          : platform
      )
    );
  };

  const handleSave = () => {
    const selectedPlatforms = platforms.filter(platform => 
      platform.checked && platform.url.trim()
    );
    
    console.log('Selected Social Media:', selectedPlatforms);
    alert(`تم حفظ ${selectedPlatforms.length} من منصات التواصل الاجتماعي بنجاح!`);
  };

  return (
    <div  className='min-h-screen bg-gray-50 p-4' dir="rtl">
      {/* Top Info Bar */}
      <div className=" px-6 mb-4 border-b border-[#0765AA] py-3 text-right text-[#0765AA] text-lg font-bold ">
          التواصل الاجتماعي
      </div>
<div className='m-6 rounded border border-[#0765AA] overflow-hidden'>
{/* Header */}
      <div className="bg-white text-gray-800  border-b border-[#0765AA] ">
        <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">   </h2>

          <h2 className="text-xl text-[#0765AA] font-bold">التواصل الاجتماعي</h2>
          <button
            onClick={handleSave}
            className="bg-[#0765AA]  text-white px-5 py-4  font-medium transition-colors"
          >
            حفظ
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="space-y-1">
          {platforms.map((platform) => (
            <div 
              key={platform.id}
              className="flex items-center py-3 px-2 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded"
            >
              {/* Social Icon */}
                             <div className="flex items-center justify-center p-2 border border-[#0765AA] border-l-0 ">
<div className={`  flex items-center justify-center  `}>
    <img src={platform.icon} alt="img" className="w-8 h-8" />
               
              </div>
                             </div>

              

              {/* URL Input */}
              <input
                type="text"
                value={platform.url}
                onChange={(e) => updateUrl(platform.id, e.target.value)}
                onFocus={() => !platform.checked && toggleCheckbox(platform.id)}
                placeholder={platform.placeholder}
                className="flex-1 px-4 py-3 border border-[#0765AA] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                dir="ltr"
              />

              {/* Checkbox */}
              <div className="">
                  <button
                  onClick={() => toggleCheckbox(platform.id)}
                  className={` w-12 h-12   mr-2  border border-[#0765AA] flex items-center justify-center transition-all`}
                >
                  {platform.checked && (
                                 <img src="/images/group/true.png" alt="selected" className="w-6 h-6" />

                  )}
                </button>
               </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 text-center">
            تم تحديد {platforms.filter(p => p.checked).length} من أصل {platforms.length} منصة
          </div>
        </div>
      </div>
</div>
      
    </div>
  );
};

export default SocialMedia;