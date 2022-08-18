import React, { useState } from "react";
import ArrowDown from "../icons/ArrowDown";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { removeCookies } from "cookies-next";

const candidateLinksData = [
  { text: "Add a Candidate", link: "/admin/createCandidate" },
  { text: "Applied Candidate", link: "/admin/appliedCandidates?status=draft" },
  { text: "Dashboard", link: "/admin/dashboard" },
];

const SideBar = () => {
  const router = useRouter();
  const pathName = router.pathname;

  const [openCandidate, setOpenCandidate] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);

  const logoutHandler = () => {
    removeCookies("token");
    router.push("/admin/signIn");
  };

  // const style = ["hover:text-gray2 transition100"];

  return (
    <div className="w-65 px-7.5 sidebar fixed left-0 top-0 pt-24 flex min-h-screen">
      {/*link container  */}
      <div className="text-sm font-semibold text-gray3 w-50 mt-8 flex flex-col">
        <NextLink href="/admin/dashboard">
          <a
            className={`${
              pathName === "/admin/dashboard" ? "text-black" : ""
            } w-max`}
          >
            Dashboard
          </a>
        </NextLink>
        <div className="mb-3 mt-3">
          <div
            className={`flex items-center justify-between w-full cursor-pointer ${
              candidateLinksData.find((item) => item.link.includes(pathName))
                ? "text-black"
                : ""
            }`}
            onClick={() => {
              setOpenCandidate(!openCandidate);
            }}
          >
            <p>Candidate</p>
            <span
              className={`${openCandidate ? "rotate-180" : ""} transition100`}
            >
              <ArrowDown />
            </span>
          </div>

          <div
            className={`ml-3 ${
              openCandidate ? "h-20 mt-3" : "h-0"
            } overflow-hidden transition100`}
          >
            {candidateLinksData.map((link) => (
              <NextLink key={link.link} href={link.link}>
                <a
                  className={`mb-3 ${
                    link.link.includes(pathName) ? "text-black" : ""
                  }`}
                >
                  {link.text}
                </a>
              </NextLink>
            ))}
            {/* <NextLink href="/admin/createCandidate">
              <a
                className={`mb-3 ${
                  pathName === "/admin/createCandidate" ? "text-black" : ""
                }`}
              >
                Add a Candidate
              </a>
            </NextLink>
            <NextLink href="/admin/appliedCandidates?status=draft">
              <a
                className={
                  pathName === "/admin/appliedCandidates" ? "text-black" : ""
                }
              >
                Applied Candidate
              </a>
            </NextLink>
            <NextLink href="/admin/dashboard">
              <a
                className={pathName === "/admin/dashboard" ? "text-black" : ""}
              >
                dashboard
              </a>
            </NextLink> */}
          </div>
        </div>
        <div className="mb-3">
          <div
            className={`flex items-center justify-between w-full cursor-pointer ${
              pathName === "/admin/createSkill"
                ? "text-black"
                : pathName === "/admin/allSkills"
                ? "text-black"
                : ""
            }`}
            onClick={() => {
              setOpenSkill(!openSkill);
            }}
          >
            <p>Skills</p>
            <span className={`${openSkill ? "rotate-180" : ""} transition100`}>
              <ArrowDown />
            </span>
          </div>

          <div
            className={`ml-3 flex flex-col ${
              openSkill ? "min-h-[20px] mt-3" : "h-0"
            } overflow-hidden transition100`}
          >
            <NextLink href="/admin/createSkill">
              <a
                className={`mb-2 ${
                  pathName === "/admin/createSkill" ? "text-black" : ""
                }`}
              >
                Add a Skill
              </a>
            </NextLink>
            <NextLink href="/admin/allSkills">
              <a
                className={pathName === "/admin/allSkills" ? "text-black" : ""}
              >
                All Skills
              </a>
            </NextLink>
          </div>
        </div>

        <NextLink href="/admin/createProperty">
          <a
            className={`mb-2.5 w-max ${
              pathName.includes("createProperty") ? "text-black" : ""
            }`}
          >
            Create Property
          </a>
        </NextLink>
        <NextLink href="/admin/termsAndConditions">
          <a className="mb-2.5 w-max">Terms and Conditions</a>
        </NextLink>

        <a onClick={logoutHandler} className="mb-2.5 w-max">
          Sign Out
        </a>
      </div>
    </div>
  );
};

export default SideBar;
