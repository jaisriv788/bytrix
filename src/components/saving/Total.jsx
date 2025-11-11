function Total() {
  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="max-w-xl rounded-3xl p-0.5 w-full bg-gradient-to-tr from-[#0afcb3] via-[#0891e0] to-[#08e7d5]">
        <div className="bg-black p-3 sm:p-5 rounded-3xl flex flex-col gap-5">
          <div className=" bg-gradient-to-tr text-black from-[#0afcb3] to-[#0891e0] rounded-xl rounded-xl px-5 py-3">
            <div>Total Amount</div>
            <div className="text-4xl font-extrabold flex gap-5 items-center">
              0 USDT{" "}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 p-0.5 bg-gradient-to-tr text-black from-[#0afcb3] to-[#0891e0] rounded-xl">
              <div className="flex flex-col gap-2 bg-black rounded-xl text-white px-3 sm:px-5 py-3 sm:py-4">
                <span className="font-bold text-lg text-gray-400">
                  Saving Amount
                </span>
                <span className="font-extrabold text-3xl bg-gradient-to-tr from-[#0afcb3] to-[#0891e0] text-transparent bg-clip-text">
                  0 USDT
                </span>
              </div>
            </div>
            <div className="flex-1 p-0.5 bg-gradient-to-tr text-black from-[#0afcb3] to-[#0891e0] rounded-xl">
              <div className="flex flex-col gap-2 bg-black rounded-xl text-white px-3 sm:px-5 py-3 sm:py-4">
                <span className="font-bold text-lg text-gray-400">
                  Saving Amount
                </span>
                <span className="font-extrabold text-3xl bg-gradient-to-tr from-[#0afcb3] to-[#0891e0] text-transparent bg-clip-text">
                  0 USDT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Total;
