import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black/80 backdrop-blur-xl border-t border-gray-800 text-gray-300 py-12">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* Company Info */}
                <div>
                    <h4 className="text-xl text-white font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                        BRNNO
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        The future of service booking - seamless, powerful, connected. Experience the next generation of digital services.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h5 className="font-bold mb-3 text-white tracking-wide">QUICK ACCESS</h5>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-blue-400 transition-colors duration-200">HOME</Link></li>
                        <li><Link href="/search" className="hover:text-blue-400 transition-colors duration-200">SEARCH</Link></li>
                        <li><Link href="/about" className="hover:text-blue-400 transition-colors duration-200">ABOUT</Link></li>
                        <li><Link href="/contact" className="hover:text-blue-400 transition-colors duration-200">CONTACT</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h5 className="font-bold mb-3 text-white tracking-wide">RESOURCES</h5>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/blog" className="hover:text-blue-400 transition-colors duration-200">BLOG</Link></li>
                        <li><Link href="/faq" className="hover:text-blue-400 transition-colors duration-200">FAQ</Link></li>
                        <li><Link href="/terms" className="hover:text-blue-400 transition-colors duration-200">TERMS</Link></li>
                        <li><Link href="/privacy" className="hover:text-blue-400 transition-colors duration-200">PRIVACY</Link></li>
                    </ul>
                </div>

                {/* Social & Subscribe */}
                <div>
                    <h5 className="font-bold mb-3 text-white tracking-wide">CONNECT</h5>
                    <div className="flex space-x-4 mb-6">
                        <a href="#" className="hover:text-blue-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-200"><FaFacebookF /></a>
                        <a href="#" className="hover:text-blue-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-200"><FaTwitter /></a>
                        <a href="#" className="hover:text-blue-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-200"><FaInstagram /></a>
                        <a href="#" className="hover:text-blue-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-200"><FaLinkedinIn /></a>
                    </div>
                    <form className="flex flex-col space-y-3">
                        <label htmlFor="footer-email" className="sr-only">Email</label>
                        <input
                            id="footer-email"
                            type="email"
                            placeholder="YOUR EMAIL"
                            className="px-3 py-3 rounded-lg mb-3 text-white bg-gray-900/50 border border-gray-700 placeholder-gray-400 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-xl"
                        />
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg text-sm min-h-[44px] font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                            SUBSCRIBE
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-10 text-center text-xs text-gray-500 border-t border-gray-800 pt-6">
                © {new Date().getFullYear()} BRNNO. All rights reserved. | The future is now.
            </div>
        </footer>
    );
} 