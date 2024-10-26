import { useQuery } from "@tanstack/react-query";
import { getAllCommettis } from "../../Services/ApiFetching/commettiApiFetch";

import { CommettiList } from "../../UI/DisplayList";
import { Link, useNavigate } from "react-router-dom";

function InprogressCommettiList() {
  const navigate = useNavigate();
  const {
    data,
    error: commettisError,
    isPending: commettisLoading,
  } = useQuery({
    queryKey: ["getAllCommettis", { status: "inProgress" }],
    queryFn: getAllCommettis,
  });

  const commettiData = data?.data?.data.commettis;

  const handleClick = (id) => {
    navigate(`/adminarea/commetti/commettidetails/${id}`);
  };

  return (
    <div className="py-10">
      <div className="flex flex-col space-y-3 px-5 md:px-0">
        {commettiData?.map((data, index) => (
          <div
            key={index}
            className="w-full lg:w-3/5 hover:cursor-pointer"
            onClick={() => handleClick(data.id)}
          >
            <CommettiList
              data={data}
              index={index < 9 ? `0${index + 1}` : index + 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default InprogressCommettiList;
