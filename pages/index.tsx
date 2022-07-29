import type { NextPage } from "next";
import Image from "next/image";
import ideaImg from "../assets/img/header-img-2.png";
import featureImg from "../assets/img/features.png";
import AfsIcon from "../components/icons/AfsIcon";
import BackendIcon from "../components/icons/BackendIcon";
import FrontendIcon from "../components/icons/FrontendIcon";
import JavaIcon from "../components/icons/JavaIcon";
import EndToEndIcon from "../components/icons/EndToEndIcon";
import RoundedButton from "../components/partials/RoundedButton";
import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../store/context/AppContext";
import NextLink from "next/link";
import styles from "../styles/Images.module.css";
import SearchInput from "../components/SearchInput";

const dummyData = [
  {
    name: "AFS",
    icon: <AfsIcon />,
  },
  {
    name: "Back End",
    icon: <BackendIcon />,
  },
  {
    name: "Front end",
    icon: <FrontendIcon />,
  },
  {
    name: "End To End",
    icon: <EndToEndIcon />,
  },
  {
    name: "java",
    icon: <JavaIcon />,
  },

  {
    name: "AFS",
    icon: <AfsIcon />,
  },
  {
    name: "Back End",
    icon: <BackendIcon />,
  },
  {
    name: "Front end",
    icon: <FrontendIcon />,
  },
  {
    name: "End To End",
    icon: <EndToEndIcon />,
  },
  {
    name: "java",
    icon: <JavaIcon />,
  },
];

const Home: NextPage = () => {
  const router = useRouter();
  const [selectedSkill, setSelectedSkill] = useState<{ name: string }>();
  const { setLandingPageSearchFormValue } = useAppContext();

  const searchFormSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;
    // router.push(`/search?q=${selectedSkill.name.replace(" ", "-")}`);

    setLandingPageSearchFormValue(selectedSkill);
    router.push("/search");
  };

  return (
    <section className="min-h-full">
      <div className=" w-full h-full lg:pt-10 md:pt-5 max-w-screen-2xl m-auto">
        {/* header */}

        <div className=" flex items-center justify-center">
          <div className={`rounded-lg md:p-5 w-full ${styles.main}`}>
            <div className="flex items-center mb-10 justify-between xl:justify-center text-white">
              <div className="xl:w-11/12 md:w-3/4 w-full">
                <h2 className="lg:text-[32px] font-semibold mb-2 md:mb-5 text-2xl md:text-[25px]">
                  Measure your candidates on
                </h2>
                <h2 className="lg:text-[48px] text-3xl md:text-[35px] mb-8 md:mb-14 font-bold leading-snug">
                  Job skills, Personality and Fit
                </h2>

                <h3 className="text-2xl">
                  Also, apply as a{" "}
                  <span className="font-bold text-4xl">Developer</span>
                </h3>
              </div>

              <div className="w-40 hidden sm:inline-block lg:w-80">
                <Image src={ideaImg} alt="hello" />
              </div>
            </div>

            <form
              className="flex items-center gap-5 justify-center lg:mt-20 md:mt-10 sm:mt-5"
              onSubmit={searchFormSubmitHandler}
            >
              <SearchInput
                showSkills
                selected={selectedSkill}
                setSelected={(e: { name: string }) => setSelectedSkill(e)}
                placeholder="Skill Search"
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-9 px-9 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* most popular skills */}
        <div className="pt-10">
          <div className="font-semibold text-neptuneBlue p-2 lg:pl-20 md:pl-10 sm:pl-5 pl-5">
            Most Popular skills
          </div>
          <div className={`${styles.popularSkillsBgImg} mt-4 rounded`}>
            <div className="grid grid-cols-3 sm:grid-cols-5 max-w-6xl m-auto items-center justify-center gap-x-4 md:gap-x-6 lg:gap-x-11 gap-y-10 py-10 px-4 sm:px-[15px] md:px-[30px] lg:px-[60px] capitalize">
              {dummyData.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="bg-white flex flex-col w-full h-full rounded p-3 md:p-5"
                  >
                    <div className="pl-2">{item.name}</div>
                    <span className="w-9 h-10 sm:w-11 sm:h-12 ml-auto mt-6">
                      {item.icon}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* all skills list */}
          <AllSkills />

          <div className="flex items-center justify-between rounded-lg max-w-6xl m-auto mt-[70px] px-3 mb-10 md:px-7 xl:px-0">
            <div className="text-[15px] w-11/12 sm:w-1/2">
              <h2 className="text-[30px] text-gray2 font-bold mb-5 lg:mb-10">
                Apply as a{" "}
                <span className="font-extrabold uppercase text-black">
                  Developer
                </span>
              </h2>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Repudiandae sit deserunt, laboriosam mollitia magnam vel, sint
              officia necessitatibus doloribus sunt amet quia velit doloremque,
              aliquid ipsam deleniti suscipit! Possimus, illo!
              <div className="font-semibold mt-5 lg:mt-10">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Facere, tenetur vel! Beata.
              </div>
              <NextLink href="/apply">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-7"
                  type="button"
                >
                  Apply now
                </button>
              </NextLink>
            </div>
            <div className="w-1/2 imgContainer hidden sm:inline-block">
              <Image src={featureImg} alt="img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function AllSkills() {
  const [activeSkillBtn, setActiveSkillBtn] = useState("top");
  const [allSkillsData, setAllSkillsData] = useState(dummyData);
  const alphabetically = [...dummyData].sort((a: any, b: any) =>
    a.name > b.name ? 1 : -1
  );

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="bg-gradient-to-r from-[#061446] to-[#0e6299eb] h-20 rounded-lg flex justify-between items-center mt-20 w-[99%] md:w-[90%] xl:w-5/6 mb-5 ms:px-1 px-3 sm:px-7.5">
          <h1 className="text-white font-semibold text-sm">ALL SKILLS</h1>
          <div className="bg-gray5 rounded-full">
            <RoundedButton
              className="w-36 capitalize"
              active={activeSkillBtn === "top"}
              onClick={() => {
                setActiveSkillBtn("top");
                setAllSkillsData(dummyData);
              }}
            >
              top
            </RoundedButton>
            <RoundedButton
              active={activeSkillBtn === "alphabetical"}
              className="w-36 capitalize"
              onClick={() => {
                setActiveSkillBtn("alphabetical");
                setAllSkillsData(alphabetically);
              }}
            >
              alphabetical
            </RoundedButton>
          </div>
        </div>
      </div>
      <div className="mb-10 grid ms:grid-cols-1 grid-cols-2 sm:grid-cols-3 ms:max-w-[80%] max-w-[98%] md:max-w-[90%] xl:max-w-6xl m-auto gap-x-[30px]">
        {allSkillsData.map((item, i) => {
          console.log("ITEM", item);

          return (
            <div
              key={i}
              className="flex items-center justify-between w-full mt-5 bg-screen rounded max-h-12 min-h-[45px] px-2 h-10 capitalize"
            >
              <p className="text-sm font-semibold text-black">{item.name}</p>
              <span className="w-6 h-6">{item.icon}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
