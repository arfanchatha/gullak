import { AssistanList } from "../../../UI/DisplayList";

function AssistantCommetti({ data }) {
  return (
    <div className="space-y-3 px-5 py-2 overflow-y-auto">
      {data?.map((user, index) => (
        <div key={index}>
          <AssistanList
            data={user}
            // index={index < 10 ? `0${index + 1}` : index + 1}
          />
        </div>
      ))}
    </div>
  );
}

export default AssistantCommetti;
