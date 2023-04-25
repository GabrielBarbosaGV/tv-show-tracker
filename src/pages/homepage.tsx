import { getEmailName } from "@/util/get-email-name";
import { useMemo, useState } from "react";
import Modal from 'react-modal';
import { Show } from '@/persistence/show';
import { Subject, debounceTime, distinctUntilChanged, mergeMap } from "rxjs";
import { checkUnauthorizedOrEmailNotVerifiedThen } from "@/util/check-unauthorized-or-email-not-verified-then";
import { getUserProps } from "@/util/get-user-props";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = checkUnauthorizedOrEmailNotVerifiedThen(getUserProps);

export default function HomePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const emailName = useMemo(() => user.email ? getEmailName(user.email) : null, [user.email]);

  const [isAddingShow, setIsAddingShow] = useState(false);
  const [hasJustAddedShow, setHasJustAddedShow] = useState(false);

  const [isSearchingForShow, setIsSearchingForShow] = useState(false);

  const handleAddShowSubmit = async (show: Omit<Show, 'uid'>) => {
    try {
      const uid = user.uid!;

      const res = await fetch(`/api/does-show-already-exist?showName=${encodeURIComponent(show.name)}`);

      const json = await res.json();

      const { doesShowAlreadyExist } = json;

      if (doesShowAlreadyExist) {
        alert('Show with same name has already been added');
        return;
      }

      await fetch('/api/shows', { method: 'POST', body: JSON.stringify({ ...show, uid }) });

      setIsAddingShow(false);

      setHasJustAddedShow(true);

      setTimeout(() => setHasJustAddedShow(false), 2000);
    } catch (err) {
      alert('An error occurred when trying to add the show. Check the console for details');

      console.trace(err);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <div className="">
        <h1 className="text-3xl m-4">
          Welcome Home, {emailName ?? 'you'}!
        </h1>

        <h2 className="text-lg text-center text-black text-opacity-40">
          What do you feel like doing?
        </h2>
      </div>

      <div className="flex flex-row">
        <ShadowedBox onClick={() => setIsAddingShow(true)}>
          Add a new show
        </ShadowedBox>

        <ShadowedBox onClick={() => setIsSearchingForShow(true)}>
          View or edit an existing show
        </ShadowedBox>
      </div>

      {hasJustAddedShow && <span className="text-blue-500">Show added successfully</span>}

      <Modal
        isOpen={isAddingShow}
        className="
          flex
          flex-col
          justify-center
          items-center
          h-[100vh]
          w-[100vw]
          bg-gray-200
          bg-opacity-70
        "
      >
        <AddShow onSubmit={handleAddShowSubmit} />

        <button className="bg-gray-400 p-2 m-4 rounded-full" onClick={() => setIsAddingShow(false)}>
          Close
        </button>
      </Modal>

      <Modal
        isOpen={isSearchingForShow}
        className="
          flex
          flex-col
          justify-center
          items-center
          h-[100vh]
          w-[100vw]
          bg-gray-200
          bg-opacity-70
        "
      >
        <SearchShows uid={user.uid ?? ''} />

        <button className="bg-gray-400 p-2 m-4 rounded-full" onClick={() => setIsSearchingForShow(false)}>
          Close
        </button>
      </Modal>
    </div>
  );
}

interface ShadowedBoxProps {
  children?: React.ReactNode,
  onClick?: () => void
}

const ShadowedBox: React.FC<ShadowedBoxProps> = ({ children, onClick }) => {
  return (
    <div
      className="
        shadow-black
        shadow-md
        p-8
        rounded-md
        w-[20vw]
        h-[20vh]
        text-2xl
        m-8
        bg-red-400
        flex
        justify-center
        items-center
        text-center
        cursor-pointer
        active:scale-90
      "

      onClick={onClick}
    >
      { children }
    </div>
  );
};

interface AddShowProps {
  onSubmit: (show: Omit<Show, 'uid'>) => void
}

const AddShow: React.FC<AddShowProps> = ({ onSubmit }: AddShowProps) => {
  const [name, setName] = useState('');
  const [lastEpisodeWatched, setLastEpisodeWatched] = useState('');
  const [nextIntendedEpisode, setNextIntendedEpisode] = useState('');

  return (
    <div className="flex flex-col justify-center items-center">
      <input
        className="p-1 m-2 rounded-md"
        value={name}
        placeholder="Show name"
        onChange={(event) => setName(event.target.value)}
      />

      <input
        className="p-1 m-2 rounded-md"
        value={lastEpisodeWatched}
        placeholder="Last episode watched (e.g. S01E01)"
        onChange={(event) => setLastEpisodeWatched(event.target.value)}
      />

      <input
        className="p-1 m-2 rounded-md"
        value={nextIntendedEpisode}
        placeholder="Next intended episode (e.g. S01E02)"
        onChange={(event) => setNextIntendedEpisode(event.target.value)}
      />

      <button
        className="p-2 m-4 rounded-full bg-red-400"
        onClick={() => onSubmit({ name, lastEpisodeWatched, nextIntendedEpisode })}
      >
        Submit
      </button>
    </div>
  );
};

interface SearchShowsProps {
  uid: string
}

const SearchShows: React.FC<SearchShowsProps> = ({ uid }: SearchShowsProps) => {
  const [searchResults, setSearchResults] = useState<Show[]>([]);
  
  const search = useMemo(() => {
    const searchSubject = new Subject<string>();

    searchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      mergeMap(terms => fetch(`/api/show-search?terms=${encodeURIComponent(terms)}&uid=${encodeURIComponent(uid)}`))
    ).subscribe(res => res.json().then(setSearchResults));

    return searchSubject;
  }, []);

  return (
    <>
      <input
        placeholder="Your search terms here"
        className="p-2 rounded-md"
        onChange={event => search.next(event.target.value)}
      />

      <div className="grid grid-cols-4 overflow-auto bg-gray-200 rounded-md p-3 m-4">

        {searchResults.map(show => (
          <div className="shadow-black shadow-md p-4 text-center bg-white m-4" key={show.id!}>
            <span className="text-xl">
              {show.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

