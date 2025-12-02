import React from "react";
import gif from "../../assets/gif1.gif";

export default function Content() {
  return (
    <>
    <div className="w-full bg-[#111] text-gray-300 py-5 px-6 md:px-20">

      {/* Top small Description */}
      <p className=" text-sm md:text-base max-w-5xl mx-auto leading-relaxed mb-16">
      Bytrix One is a decentralized finance (DeFi) platform based on blockchain technology, aiming to establish a distributed digital world system with transparency, accessibility and inclusiveness. It realizes a decentralized peer-to-peer economic circulation model, and meets the savings needs of global users and institutions for capital circulation, leasing, and rotating income with zero risk and security.
      </p>

      {/* Main Section (Width same as paragraph) */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">

        {/* LEFT TEXT */}
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00ff80] mb-6">
            Meaning of Bytrix One
          </h2>

          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
           Bit (Bitcoin)" is a digital cryptocurrency known for its characteristics of decentralization, anonymity, immutability, and limited supply. It contains infinite innovation and possibilities. "Nest" is derived from the symbol of beehives and nests, representing a secure, stable, and inclusive financial ecosystem concept in the world of cryptocurrency."Bytrix One" is based on the development of the Bitcoin ecosystem, as it does not rely on the issuance and management of central institutions or governments, but is maintained through a set of code and distributed networks. It is known for its decentralized, anonymity, immutability, and limited supply characteristics and is known as the "blockchain gold" by people. Bytrix One will become a digital paradise that integrates Defi, cryptography, homomorphic encryption, digitization, and community spirit, providing users with multi-dimensional "zero-risk" financial services and security guarantees, and is committed to creating a thriving and vibrant Bytrix One ecosystem.People can experiment with new circulation economic models, create innovative lending patterns, explore novel saving methods, free from human interference, and pave the way for the future of digitization.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="md:w-1/2 flex flex-col items-center gap-12">
          <img src={gif} alt="gif" className="w-80 md:w-96" />
        </div>

      </div>

<div className="max-w-5xl mx-auto my-20  bg-[#2b2b2b]  text-gray-300 p-8 md:p-10 rounded-3xl border border-gray-600 shadow-lg">

  <h2 className="text-xl md:text-2xl font-bold text-[#00ff6a] mb-4">
    Conclusion:
  </h2>

  <p className="leading-relaxed text-sm md:text-base">
    As a decentralized finance (DeFi) platform based on blockchain technology, 
    Bytrix One not only provides users with safe, efficient and transparent 
    cryptocurrency leasing, savings and liquidity services, but also represents 
    the huge potential and application prospects of blockchain technology in the 
    financial field. Through decentralized architecture and smart contract 
    technology, Bytrix One effectively solves many problems in the traditional 
    financial system. At the same time, Bytrix One also brings more financial 
    freedom and innovation to global users and promotes the development and 
    innovation of the financial market. In the future, with the continuous 
    development of blockchain technology and the expansion of application 
    scenarios, Bytrix One will continue to be committed to providing users with 
    more diversified and innovative financial services, promoting the progress 
    and development of the financial field, and realizing a more open, inclusive 
    and secure financial ecology.
  </p>

</div>
    </div>

</>

  );
}
