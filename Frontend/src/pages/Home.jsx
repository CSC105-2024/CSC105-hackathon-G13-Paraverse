import React from "react";

const Home = () => {
    return (
        <div className="bg-gray-100 min-h-screen px-4 md:px-16 py-18">
            <div className="bg-white rounded shadow-md p-6 max-w-3xl mx-auto mb-10">
                <h1 className="text-2xl font-semibold text-[#5885AF] mb-2">Welcome to Paraverse</h1>
                <p className="text-gray-600 mb-4">Dive into alternate realities and explore fascinating "what if" scenarios.</p>
                <a href="/Post" className="bg-[#5885AF] text-white px-4 py-2 rounded hover:bg-[#416383]">
                <a href='/Post'className="bg-[#A05A2C] text-white px-4 py-2 rounded hover:bg-[#8B4513]">
                    Post your senario
                </a>
            </div>

            <h2 className="text-lg font-semibold mb-4">Senarios</h2>
            <div className="text-gray-500">No scenarios yet.</div>
        </div>
    );
}

export default Home;