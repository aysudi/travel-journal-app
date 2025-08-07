import { useTravelLists } from "../../hooks/useTravelList";

const Lists = () => {
  const { data: lists, isLoading, isError, error } = useTravelLists();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  // if (!lists || lists.length === 0) return <div>No travel lists found.</div>;

  console.log(lists);

  return (
    <div>
      <h1>Travel Lists</h1>
      {/* <ul>
        {lists &&
          lists.map((list: any) => <li key={list._id}>{list.title}</li>)}
      </ul> */}
    </div>
  );
};

export default Lists;
