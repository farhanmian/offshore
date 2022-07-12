import React from "react";
import { URLS } from "../api/config";

const TermsContainer: React.FC<{
  className: string;
  heading: string;
  text: string;
}> = ({ className, text, heading }) => {
  return (
    <div className={`${className}`}>
      <p className="text-sm font-bold mb-3">{heading}</p>
      <div className="p-4 sm:p-7.5 font-normal text-dark bg-white rounded-lg border border-gray3 ">
        <p className="mb-3">{text}</p>
      </div>
    </div>
  );
};

const TermsAndConditions: React.FC<{
  terms: { data: []; status: string | number };
}> = ({ terms }) => {
  console.log(terms);

  return (
    <section className="h-full px-3 py-7.5 sm:p-7.5 m-auto">
      <div className="max-w-screen-2xl m-auto">
        <p className="text-xs font-semibold text-black mb-5">
          <span className="text-gray3">{`Home > `}</span> Candidate’s Terms and
          conditions
        </p>

        <div className="rounded-lg pb-7.5 bg-gray6">
          {/* heading and option container */}
          <div className="h-16 flex items-center justify-between px-3 bg-primaryBlue w-full rounded-lg mb-5">
            <h6 className="text-white text-sm md:text-base uppercase font-semibold lg:font-bold ml-0 sm:ml-9">
              Terms and conditions
            </h6>
            <select
              id="hiringProcess"
              name="hiringProcess"
              className="w-[180px] sm:w-[250px] lg:w-[300px] h-10 rounded focus:outline-none px-2 sm:px-4 font-bold text-sm lg:text-base"
            >
              <option>Hiring Process</option>
              <option>Hiring In Process</option>
              <option>Hiring Completed</option>
              <option>Hiring Ongoing</option>
              <option>Hiring canceled</option>
              <option>13</option>
              <option>14</option>
              <option>15</option>
            </select>
          </div>
          <div className="px-3 sm:px-7.5">
            {terms.data.length > 0 ? (
              terms.data.map((item: { heading: string; text: string }, i) => {
                return (
                  <TermsContainer
                    key={i}
                    className="mb-7.5"
                    heading={item.heading}
                    text={item.text}
                  />
                );
              })
            ) : (
              <p className="text-center font-bold text-base">
                No Terms and conditions added!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditions;

export const getServerSideProps = async (context: any) => {
  const { token } = context.req.cookies;
  let header;

  if (token) {
    header = {
      "Access-Control-Allow-Origin": "*",
      Authorization: token ? "Bearer " + token : "",
    };
  } else {
    header = {
      "Access-Control-Allow-Origin": "*",
    };
  }

  const res = await fetch(URLS.GET_TERMS, {
    method: "GET",
    headers: header,
  });

  if (res.status !== 200) {
    return {
      props: {
        terms: { data: [], status: 401 },
      },
    };
  }

  const data = await res.json();

  return {
    props: {
      terms: { data: data.terms, status: res.status },
    },
  };
};
