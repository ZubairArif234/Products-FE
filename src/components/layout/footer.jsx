
import React from "react";

const Footer = () => {
  return (
    <div className="min-h-[8vh] flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 p-4 lg:p-6 text-center sm:text-left">
      <p className="text-slate-400 text-xs sm:text-sm">
        © {new Date().getFullYear()} Copyright All Rights Reserved{" "}
        <b>website name</b>
      </p>
      <p className="text-slate-400 text-xs sm:text-sm">
        Design & Developed by zubair
      </p>
    </div>
  );
};

export default Footer;
