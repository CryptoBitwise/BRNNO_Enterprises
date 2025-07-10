import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* Company Info */}
                <div>
                    <h4 className="text-xl text-white font-semibold mb-4">Reviva</h4>
                    <p className="text-sm">
                        Connecting you with trusted local detailing services for cars, boats, RVs, and more.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h5 className="font-semibold mb-3">Quick Links</h5>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-white">Home</Link></li>
                        <li><Link href="/search" className="hover:text-white">Search</Link></li>
                        <li><Link href="/about" className="hover:text-white">About</Link></li>
                        <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h5 className="font-semibold mb-3">Resources</h5>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                        <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                        <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                        <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Social & Subscribe */}
                <div>
                    <h5 className="font-semibold mb-3">Stay Connected</h5>
                    <div className="flex space-x-4 mb-6">
                        <a href="#" className="hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"><FaFacebookF /></a>
                        <a href="#" className="hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"><FaTwitter /></a>
                        <a href="#" className="hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"><FaInstagram /></a>
                        <a href="#" className="hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"><FaLinkedinIn /></a>
                    </div>
                    <form className="flex flex-col">
                        <label htmlFor="footer-email" className="sr-only">Email</label>
                        <input
                            id="footer-email"
                            type="email"
                            placeholder="Your email"
                            className="px-3 py-3 rounded-md mb-3 text-gray-900 min-h-[44px]"
                        />
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md text-sm min-h-[44px]">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-10 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Reviva. All rights reserved.
            </div>
        </footer>
    );
} 