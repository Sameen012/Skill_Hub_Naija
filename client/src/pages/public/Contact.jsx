import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
// FIX: Added extra "../" to reach the correct folder
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const Contact = () => {
    // State for FAQ Accordion
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "Are the courses self-paced?",
            answer: "Yes! All our courses are completely self-paced. You can start anytime and learn according to your own schedule."
        },
        {
            question: "Do you offer certificates?",
            answer: "Absolutely. Upon completing a course and passing the final assessment, you will receive a verifiable certificate of completion."
        },
        {
            question: "Is the platform free?",
            answer: "We offer both free and premium courses. Our mission is to make education accessible, so many foundational courses are free."
        },
        {
            question: "How do I get support if I'm stuck?",
            answer: "Each course comes with a community forum where you can ask questions. Premium users also get priority email support."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            <Navbar />

            {/* 1. HERO SECTION */}
            <div className="bg-blue-900 text-white pt-20 pb-32">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Have a question about our courses or need technical support? 
                        We're here to help you on your learning journey.
                    </p>
                </div>
            </div>

            {/* 2. MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                    <MessageSquare size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Send us a message</h2>
                            </div>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="John Doe" 
                                            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="john@example.com" 
                                            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Subject</label>
                                    <select className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-500/20">
                                        <option>General Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>Course Feedback</option>
                                        <option>Partnership</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Message</label>
                                    <textarea 
                                        rows="5" 
                                        placeholder="How can we help you today?" 
                                        className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20"
                                    ></textarea>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                                    <Send size={20} /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Contact Info & FAQ */}
                    <div className="space-y-8">
                        
                        <div className="rounded-2xl bg-blue-600 p-8 text-white shadow-xl">
                            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Mail className="opacity-80 mt-1" size={20} />
                                    <div>
                                        <p className="font-semibold text-blue-100 text-sm">Email Us</p>
                                        <p className="font-medium">support@skillhub.ng</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="opacity-80 mt-1" size={20} />
                                    <div>
                                        <p className="font-semibold text-blue-100 text-sm">Call Us</p>
                                        <p className="font-medium">+234 800 123 4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="opacity-80 mt-1" size={20} />
                                    <div>
                                        <p className="font-semibold text-blue-100 text-sm">Visit Us</p>
                                        <p className="font-medium">Sokoto, Nigeria</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                            <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-white">Frequently Asked</h3>
                            <div className="space-y-2">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border border-slate-100 rounded-lg overflow-hidden">
                                        <button 
                                            onClick={() => toggleFaq(index)}
                                            className="flex w-full items-center justify-between bg-slate-50 p-4 text-left transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                        >
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{faq.question}</span>
                                            {openFaq === index ? <ChevronUp size={16} className="text-blue-600"/> : <ChevronDown size={16} className="text-gray-400"/>}
                                        </button>
                                        {openFaq === index && (
                                            <div className="border-t border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;