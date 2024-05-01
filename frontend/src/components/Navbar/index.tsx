import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            Lobo
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                nav links
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        buttons
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;