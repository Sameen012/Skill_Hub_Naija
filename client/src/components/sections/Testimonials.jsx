import React from 'react';

const Testimonials = () => {
  const reviews = [
    { name: "Sarah Jenkins", role: "Frontend Dev @ TechCorp", text: "Skill Hub bridged the gap between my degree and actual coding. The React course is world-class.", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Michael Chen", role: "Student", text: "I landed my first internship after completing the Full Stack track. The career section is gold.", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Jessica Alba", role: "Product Designer", text: "Finally, a platform that explains 'Why' not just 'How'. Highly recommended for beginners.", img: "https://randomuser.me/api/portraits/women/68.jpg" }
  ];

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What our learners say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-2xl relative">
              {/* Quote Icon */}
              <div className="absolute top-4 right-6 text-6xl text-blue-100 font-serif leading-none">"</div>
              
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-blue-600">{review.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm italic relative z-10">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;