import { BookOpen } from 'lucide-react';

export default function AuthBrandingSidebar({ title, subtitle, features }) {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-400 to-blue-500 p-12 flex-col justify-between relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl -ml-48 -mb-48"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                        <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">BookStore</span>
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-4">
                    {title}
                </h2>
                <p className="text-blue-100 text-lg">
                    {subtitle}
                </p>
            </div>

            <div className="relative z-10 space-y-4">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 text-white">
                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                            <feature.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-medium">{feature.title}</div>
                            <div className="text-sm text-blue-100">{feature.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
