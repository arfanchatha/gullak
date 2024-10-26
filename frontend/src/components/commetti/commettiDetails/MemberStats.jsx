import { MemberStatsList } from "../../../UI/DisplayList";

function MemberStats({ memberStats }) {
  return (
    <div className=" px-5 py-2 overflow-y-auto h-180 ">
      <div className="flex flex-col space-y-3">
        {memberStats?.length > 0 ? (
          memberStats?.map((data, index) => (
            <div key={index}>
              <MemberStatsList
                data={data}
                index={index < 9 ? `0${index + 1}` : index + 1}
              />
            </div>
          ))
        ) : (
          <div className="font-bold text-xl">There is no item to show</div>
        )}
      </div>
    </div>
  );
}

export default MemberStats;
