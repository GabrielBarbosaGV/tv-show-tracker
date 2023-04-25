import { createOrReturnFirebaseApp } from "@/firebase-init";
import { ImdbLinkDetails, Show, getShowByNameAndUid } from "@/persistence/show";
import { checkUnauthorizedOrEmailNotVerifiedThen } from "@/util/check-unauthorized-or-email-not-verified-then";
import { getAuth } from "firebase/auth";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Subject, debounceTime, distinctUntilChanged, mergeMap } from "rxjs";

export const getServerSideProps = checkUnauthorizedOrEmailNotVerifiedThen(async ({ query }) => {
  const auth = getAuth(createOrReturnFirebaseApp());

  const uid = auth.currentUser?.uid!;

  const showName = query.showName as string;

  return {
    props: {
      show: await getShowByNameAndUid(showName, uid)
    }
  };
});

export default function Show({ show }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showName, setShowName] = useState(show.name);
  const [showLastWatchedEpisode, setShowLastWatchedEpisode] = useState(show.lastEpisodeWatched);
  const [showNextIntendedEpisode, setShowNextIntendedEpisode] = useState(show.nextIntendedEpisode);

  const router = useRouter();

  const handleSave = async () => {
    try {
      let updatedShow = show;

      updatedShow.name = showName;
      updatedShow.lastEpisodeWatched = showLastWatchedEpisode;
      updatedShow.nextIntendedEpisode = showNextIntendedEpisode;

      await fetch(`/api/show/${encodeURIComponent(showName)}`, { method: 'PUT', body: JSON.stringify(updatedShow) });

      router.replace('/homepage');
    } catch (err) {
      alert('An error has occured when trying to save the show. Check console for more information');

      console.trace(err);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/show/${encodeURIComponent(showName)}`, { method: 'DELETE' });

      router.replace('/homepage');
    } catch (err) {
      alert('An error has occurred when trying to delete this show. Check console for more details');

      console.trace(err);
    }
  };

  const handleLink = async (imdbId: string) => {
    await fetch(`/api/imdb/link/${encodeURIComponent(imdbId)}/${encodeURIComponent(show.name)}`, { method: 'POST' });

    router.reload();
  };

  const handleUnlink = async () => {
    await fetch(`/api/imdb/unlink/${encodeURIComponent(show.name)}`, { method: 'DELETE' });

    router.reload();
  };

  return (
    <div className="flex flex-row items-start w-[100vw] h-[100vh]">
      <div className="flex flex-col justify-start items-start p-8">
        <div className="flex flex-col text-left">
          <label>Name of the show</label>

          <input
            id="showName"
            value={showName}
            onChange={(event) => setShowName(event.target.value)}
            className="px-1 my-4 text-3xl bg-gray-200 rounded-md"
          />
        </div>

        <div className="flex flex-col text-left">
          <label>Last watched episode</label>

          <input
            id="showLastWatchedEpisode"
            value={showLastWatchedEpisode}
            onChange={(event) => setShowLastWatchedEpisode(event.target.value)}
            className="px-1 my-4 text-lg bg-gray-200 rounded-md"
          />
        </div>

        <div className="flex flex-col text-left">
          <label>Next intended episode</label>

          <input
            id="showNextIntendedEpisode"
            value={showNextIntendedEpisode}
            onChange={(event) => setShowNextIntendedEpisode(event.target.value)}
            className="px-1 my-4 text-lg bg-gray-200 rounded-md"
          />
        </div>

        <div className="flex flex-row justify-start items-center">
          <button
            className="text-center p-2 rounded-full bg-red-400 mr-2"
            onClick={handleSave}
          >
            Save
          </button>

          <button
            className="text-center p-2 rounded-full bg-red-400 mx-2"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <ImdbDetails
        showName={showName}
        show={show}
        onLink={handleLink}
        onUnlink={handleUnlink}
      />
    </div>
  );
}

interface ImdbDetailsProps {
  showName: string,
  show: Show,
  onLink: (imdbId: string) => void,
  onUnlink: () => void
}

const ImdbDetails: React.FC<ImdbDetailsProps> = ({ showName, show, onLink, onUnlink }) => {
  const [searchResults, setSearchResults] = useState<any>(null);

  const subject = useMemo(() => {
    if (show.imdbLinkDetails)
      return new Subject();

    const subject = new Subject<string>();

    subject
      .pipe(
         debounceTime(250),
         distinctUntilChanged(),
         mergeMap(name => fetch(`/api/imdb/search-by-name/${encodeURIComponent(name)}`))
      )
      .subscribe(res => res.json().then(setSearchResults));

    return subject;
  }, []);

  useEffect(() => {
    subject.next(showName);
  }, [showName]);

  const imdbLinkDetails = show.imdbLinkDetails;

  return imdbLinkDetails
    ? (
      <div className="flex flex-col items-end">
        <h2>{imdbLinkDetails.title} Details</h2>

        <img
          className="h-[30vh] rounded-md"
          alt={`${imdbLinkDetails.title} Details`}
          src={imdbLinkDetails.imageUrl}
        />

        <p className="text-justify">
          {imdbLinkDetails.plot}
        </p>

        <button className="bg-gray-400 p-2 my-2" onClick={() => onUnlink()}>
          Unlink
        </button>
      </div>
    ) : (
      <div className="flex flex-col justify-start items-end p-8 flex-grow">
        <h2 className="text-lg">IMDB details</h2>

        <span className="text-right">
          Click on the title you want to link to this show
        </span>

        <div className="grid grid-cols-1 bg-gray-400 h-[80vh] rounded-lg p-4 overflow-auto">
          {searchResults && searchResults.results.map((result: any) => (
            <div
              key={result.id}
              className="rounded-md bg-white p-2 m-2 cursor-pointer"
              onClick={() => onLink(result.id)}
            >
              {result.title}
            </div>
          ))}
        </div>
      </div>
    );
};
