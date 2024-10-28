import { DisplayCommettiList } from "../../UI/DisplayList";
import { useNavigate } from "react-router-dom";
import { useGlobalContextProps } from "../../hooks/useGlobalContextProps";

function CommettiList({ commettiData }) {
  const navigate = useNavigate();

  // const handleOptions = (e, id) => {
  //   if (document.getElementById("stop")) {
  //     e.stopPropagation();
  //   }

  //   // deleteCommettiMutate(id);
  // };

  // const handleClick = (e, id) => {
  //   if (document.getElementById("commetti-list-options")) {
  //     e.stopPropagation();
  //     console.log(id);
  //   } else if (document.getElementById("commetti-list")) {
  //     navigate(`/adminarea/commetti/commettidetails/${id}`);
  //   }
  // };
  const handleClick = (e, id) => {
    // if (document.getElementById("commetti-list")) {
    e.stopPropagation();
    console.log("options");
    console.log(id);
    // } else {
    console.log("details");
    navigate(`/adminarea/commetti/commettidetails/${id}`);
    // }
  };

  return (
    <div className="py-10">
      <div className="flex flex-col space-y-3 px-5 md:px-0">
        {commettiData?.length > 0 ? (
          commettiData?.map((data, index) => (
            <div
              key={index}
              className="w-full lg:w-3/5 hover:cursor-pointer"
              onClick={(e) => handleClick(e, data.id)}
              id="commetti-list"
            >
              <DisplayCommettiList
                data={data}
                index={index < 9 ? `0${index + 1}` : index + 1}
              />
            </div>
          ))
        ) : (
          <div className="font-bold text-xl">There is no item to display</div>
        )}
      </div>
    </div>
  );
}

export default CommettiList;
