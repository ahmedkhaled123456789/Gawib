import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../store';
import { createSocialLink, getSocialLinks, updateSocialLink } from '../../store/SocialLinksSlice';
 
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

    const dispatch = useDispatch<AppDispatch>();
  const { socialLinks } = useSelector((state: RootState) => state.socialLinks);
  console.log(socialLinks)
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
const [modalFormOpen, setModalFormOpen] = useState(false);
 const [url,setUrl]= useState("");
 const [name,setName]= useState("");
  const [status,setStatus]= useState(0);

  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
useEffect(() => {
  dispatch(getSocialLinks());
}, [dispatch]);

  const handleConfirmForm = async(e) => {
    e.preventDefault();
   if (!name) {
        toast.warn("يرجى استكمال جميع الحقول!");
        return;
      }
  
      const formData = new FormData();
      formData.append("name", name);
      formData.append("icon", image);
      formData.append("url", url);
      formData.append("is_active", status);

  
       try {
             const resultAction = await dispatch(createSocialLink(formData));
      
            if (createSocialLink.fulfilled.match(resultAction)) {
              toast.success("تمت إضافة المجموعة بنجاح!");
                 setModalFormOpen(false);
                   resetSosial();
            } else {
              toast.error("حدث خطأ أثناء الإضافة");
            }
          } catch {
            toast.error("فشل الاتصال بالسيرفر");
          }
   };
const resetSosial=() =>{
  setName("");
  setUrl("");
  setImage(null);
}
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };
  const toggleCheckbox = (id: string) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === id 
          ? { ...platform, checked: !platform.checked }
          : platform
      )
    );
  };
const handleConfirmStatus = (data: { id: string; is_active: 0 | 1 }) => {
   dispatch(
     updateSocialLink({
       id: data.id,
       data: {
         is_active: data.is_active,
         _method:"PUT",
        
       },
     }) 
   );
   console.log({
     id: data.id,
     formData: { is_active: data.is_active },
   });
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
      <div className=" flex items-center justify-between  px-6 mb-4 border-b border-[#085E9C] py-3  text-[#085E9C] text-lg font-bold ">
         
<p className="text-md  ml-16 font-bold "> التواصل الاجتماعي</p>

          <div className="flex items-center  space-x-4 space-x-reverse">
              <button  onClick={() => setModalFormOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-[#085E9C] border border-[#085E9C] px-4 py-2 rounded text-sm font-medium transition-colors"
              
              >
إضافة             </button>
            </div>

      </div>
<div className='m-6 rounded border border-[#085E9C] overflow-hidden'>
{/* Header */}
      <div className="bg-white text-gray-800  border-b border-[#085E9C] ">
        <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">   </h2>

          <h2 className="text-xl text-[#085E9C] font-bold">التواصل الاجتماعي</h2>
          <button
            onClick={handleSave}
            className="bg-[#085E9C]  text-white px-5 py-4  font-medium transition-colors"
          >
            حفظ
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="space-y-1">
          {socialLinks?.data && socialLinks?.data.map((data) => (
  <div 
    key={data.id}
    className="flex items-center py-3 px-2 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded"
  >
    {/* Social Icon */}
    <div className="flex items-center justify-center p-2 border border-[#085E9C] border-l-0 ">
      <div className="flex items-center justify-center">
        <img src={data.icon} alt="img" className="w-8 h-8" />
      </div>
    </div>

    {/* URL Input */}
    <input
      type="text"
      value={data.url}
      onChange={(e) => updateUrl(data.id, e.target.value)}
      onFocus={() => !data.checked && toggleCheckbox(data.id)}
      className="flex-1 px-4 py-3 border border-[#085E9C] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
      dir="ltr"
    />

    {/* Checkbox */}
    <div>
      <button
        onClick={() =>{
           toggleCheckbox(data.id)
             handleConfirmStatus({ id:data.id, is_active: data.is_active ? 0 : 1 })
          }}
         className="w-12 h-12 mr-2 border border-[#085E9C] flex items-center justify-center transition-all"
      >
        {data.is_active && (
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
            تم تحديد {socialLinks?.data.filter(p => p.is_active).length} من أصل {socialLinks?.data.length} منصة
          </div>
        </div>
      </div>
</div>
      

       {/* add social */}
            {modalFormOpen   && ( 
                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-md border border-blue-300">
        <form className="">
         <label className="mb-4 text-[#085E9C] font-bold text-lg"> الاسم   </label>
      <input
        type="text"
        value={name}
 onChange={(e) => setName(e.target.value)}
           className="w-full border border-[#085E9C] rounded mt-4  p-3 text-sm shadow-md outline-none text-right"
      />

<div className="flex flex-col  w-full  ">
          <label className="mb-1 text-lg font-bold text-[#085E9C]">  اللينك    </label>
          
    <input
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      type="text"
       className="w-full bg-[#D5D5D5]  rounded border border-[#085E9C] p-3 text-sm shadow-md outline-none text-right"
    />
         </div>
        <div className="w-full  flex flex-col ">
              <label className="mb-3 text-lg font-bold text-[#085E9C]">الصوره</label>
              <div
                className="w-full h-[200px]   border border-[#085E9C] flex items-center justify-center cursor-pointer rounded-md hover:shadow-lg transition"
                onClick={handleImageClick}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-[60px] h-[60px] "
                  />
                ) : (
                  <img src="/images/group/img.png" alt="Placeholder" className="w-[60px] h-[60px]" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
  <input
    type="checkbox"
    id="status"
    checked={status === 1}   // اذا كان 1 يبقى checked
    onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
    className="w-4 h-4 border border-[#085E9C] rounded"
  />
  <label htmlFor="status" className="text-[#085E9C] font-medium">
    تفعيل 
  </label>
</div>

        <div className="flex justify-center gap-4 mt-6">
             <button
            onClick={handleConfirmForm}
            className={`px-4 py-2 text-white rounded bg-[#085E9C] `}
          >
           حفظ
          </button>
          <button
            onClick={() => setModalFormOpen(false)}
            className="px-4 py-2 border border-[#085E9C] text-[#085E9C] rounded hover:bg-blue-50"
          >
            إغلاق
          </button>
         
        </div>
        </form>
      </div>
      
    </div>
            )}
    </div>
  );
};

export default SocialMedia;