"use client";
import useInView from '@/hooks/useInView';

const steps = [
    {
        icon: "🔍",
        title: "Search Services",
        desc: "Enter your ZIP code to find local detailers near you.",
    },
    {
        icon: "📋",
        title: "Choose Detailer",
        desc: "Browse profiles, ratings, and before/after galleries.",
    },
    {
        icon: "📅",
        title: "Book & Pay",
        desc: "Select a date, complete booking, and pay securely.",
    },
    {
        icon: "😊",
        title: "Enjoy the Shine",
        desc: "Sit back while your vehicle gets its epic transformation.",
    },
];

export default function HowItWorks() {
    const [ref, inView] = useInView({ threshold: 0.2 }) as [React.RefObject<HTMLDivElement>, boolean];
    return (
        <section ref={ref} className="py-16 px-6 md:px-12 lg:px-24 bg-white">
            <h2 className={`text-3xl font-bold text-gray-800 mb-12 text-center opacity-0 ${inView ? 'animate-fadeInUp' : ''}`}
                style={{ animationDelay: '100ms' }}>
                How It Works
            </h2>
            <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto opacity-0 ${inView ? 'animate-fadeInUp' : ''}`}
                style={{ animationDelay: '300ms' }}
            >
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow transition opacity-0 ${inView ? 'animate-fadeInUp' : ''}`}
                        style={{ animationDelay: `${500 + idx * 100}ms` }}
                    >
                        <div className="text-4xl mb-4">{step.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
} 