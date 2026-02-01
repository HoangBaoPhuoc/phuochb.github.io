import React from 'react';
import Section from './Section';
import ScrollReveal from './ScrollReveal';
import { Users, Star } from 'lucide-react';

const ActivityItem = ({ title, role, items }) => (
  <div className="group relative glass-panel p-6 rounded-2xl mb-6 last:mb-0 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
        <div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-700">{title}</h3>
            {role && <p className="text-blue-400 mt-1 font-medium">{role}</p>}
        </div>
        </div>
        <ul className="space-y-3">
        {items.map((item, index) => (
            <li key={index} className="flex gap-3 text-gray-300 text-lg">
            <span className="mt-1.5 min-w-1.5 h-1.5 rounded-full bg-blue-500/50" />
            <span>{item}</span>
            </li>
        ))}
        </ul>
    </div>
  </div>
);

export default function Activities() {
  const highSchoolActivities = [
    "Giấy khen hoàn thành xuất sắc nhiệm vụ trong chuỗi hoạt động chào mừng kỉ niệm 70 năm ngày thành lập trường THPT Phan Châu Trinh.",
    "Giấy khen hoàn thành xuất sắc nhiệm vụ trong công tác Đoàn và phong trào thanh niên trường học năm 2021-2022.",
    "Chứng nhận tích cực hỗ trợ “Hội trại truyền thống” trường THPT Phan Châu Trinh năm học 2022—2023.",
    "Chứng nhận tham gia tích cực hành trình thiện nguyện “Thắp sáng nụ cười vùng cao” tại thôn Đông Lâm, xã Hoà Phú, tp Đà Nẵng.",
    "Chứng nhận hoàn thành tốt nhiệm vụ trong công tác Đoàn và phong trào thanh niên trường học năm học 2022-2023.",
    "Chứng nhận tham gia tích cực chuỗi hoạt động chào mừng kỷ niệm 70 năm ngày thành lập trường THPT Phan Châu Trinh (15/9/1952-15/9/2022).",
    "Chứng nhận tham gia tích cực hành trình “Tôi yêu tổ quốc”.",
    "Chứng nhận tham gia tích cực công tác tổ chức hội thao “Thanh niên khoẻ - Thanh niên khéo”.",
    "Chứng nhận tham gia tích cực công tác tổ chức dự án thiện nguyện “Ấm”.",
    "Chứng nhận tham gia tích cực công tác tổ chức “Hành trình của mầm xanh”."
  ];

  return (
    <Section id="activities">
      <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-200">
        Union & Social Activities
      </h2>
      
      <div className="max-w-6xl mx-auto space-y-12">
        {/* University */}
        <ScrollReveal direction="left">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Users size={24} />
               </div>
               <h3 className="text-2xl font-bold text-white">University - UIT-VNUHCM</h3>
            </div>
            <ActivityItem 
              title="Faculty Networks and Communications Young Union"
              role="Collaborator → Executive Member"
              items={[
                "Executive Member (May 2024 – Present)",
                "Active contribution to faculty union activities and events.",
              ]}
            />
          </div>
        </ScrollReveal>

        {/* High School */}
        <ScrollReveal direction="right">
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                  <Star size={24} />
               </div>
               <h3 className="text-2xl font-bold text-white">High School - Phan Chau Trinh - DaNang city</h3>
            </div>
            <ActivityItem 
              title="School Union Collaborator"
              items={highSchoolActivities}
            />
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}
