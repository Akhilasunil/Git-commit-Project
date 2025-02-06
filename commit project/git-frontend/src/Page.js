import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { UserCircle } from "lucide-react";

export default function Page() {
  const { owner, repo, commitOid } = useParams();
  const [diffData, setDiffData] = useState([]);
  const [commitInfo, setCommitInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDiff = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/repositories/${owner}/${repo}/commits/${commitOid}/diff`
      );
      setDiffData(response.data);
    } catch (error) {
      console.error("Error fetching diff:", error);
    }
    setLoading(false);
  }, [owner, repo, commitOid]);

  const fetchCommitInfo = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/repositories/${owner}/${repo}/commits/${commitOid}`
      );
      setCommitInfo(response.data[0]);
    } catch (error) {
      console.error("Error fetching commit info:", error);
    }
  }, [owner, repo, commitOid]);

  useEffect(() => {
    if (!owner || !repo || !commitOid) return;
    fetchDiff();
    fetchCommitInfo();
  }, [owner, repo, commitOid, fetchDiff, fetchCommitInfo]);

  const formatDaysAgo = (dateString) => {
    const commitDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - commitDate) / (1000 * 60 * 60 * 24));
    return `${diffInDays} days ago`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-16 py-8 sm:py-12 md:py-16 bg-[#FBFDFF]">
      {commitInfo && (
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center w-full sm:w-2/3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-300 rounded-full mr-3 sm:mr-4">
              <UserCircle className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-base text-[#39496A] font-bold mb-1 font-arial">
                {commitInfo.message}
              </h2>
              <h3 className="text-xs sm:text-sm text-[#6B7280]">
                Authored by{" "}
                <span className="font-semibold">
                  {commitInfo?.author?.name || "Unknown Author"}
                </span>{" "}
                - {formatDaysAgo(commitInfo?.author?.date)}
              </h3>
            </div>
          </div>

          <div className="sm:p-4 w-full sm:w-1/3 flex flex-col items-start sm:items-end">
            {commitInfo?.committer &&
              (commitInfo.author.name !== commitInfo.committer.name ||
                commitInfo.author.date !== commitInfo.committer.date) && (
                <p className="text-xs sm:text-sm text-[#32405D]">
                  Committed by{" "}
                  <span className="font-semibold">
                    {commitInfo?.committer?.name}
                  </span>{" "}
                  {formatDaysAgo(commitInfo?.committer?.date)}
                </p>
              )}

            <p className="text-xs sm:text-sm text-[#32405D] mt-2">
              Commit <span className="font-semibold">{commitOid}</span>
            </p>

            {commitInfo?.parents?.length > 0 && (
              <p className="text-xs sm:text-sm text-[#32405D] mt-1">
                Parent{" "}
                <span className="text-[#1C7CD6]">
                  {commitInfo.parents[0].oid}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center">Loading file changes...</p>
      ) : diffData.length === 0 ? (
        <p className="text-gray-500 text-center">No file changes detected.</p>
      ) : (
        <div>
          {diffData.map((file, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <div className="mb-4 border-b border-gray-200">
                  <Disclosure.Button className="w-full flex items-center gap-2 py-2 text-sm text-[#1C7CD6]">
                    <img
                      src={"/icon.png"}
                      alt="Toggle"
                      className={`w-5 h-5 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                    <span className="break-all">{file.headFile.path}</span>
                  </Disclosure.Button>

                  <Disclosure.Panel className="mt-2 pl-4 shadow-sm pb-2 border border-gray-200">
                    {file.hunks &&
                      file.hunks.map((hunk, hIndex) => (
                        <div
                          key={hIndex}
                          className="hunk border border-gray-200 mt-2 overflow-auto text-[#657B83] font-mono"
                        >
                          <pre className="header text-sm text-[#6D84B0] p-2 bg-gray-100">
                            {hunk.header}
                          </pre>
                          <div className="lines font-mono">
                            {hunk.lines &&
                              hunk.lines.map((line, lineIndex) => (
                                <pre
                                  key={lineIndex}
                                  className={`line text-xs sm:text-sm ${
                                    line.content.startsWith("+")
                                      ? "bg-[#D8FFCB]"
                                      : line.content.startsWith("-")
                                      ? "bg-[#FFE4E9]"
                                      : "bg-white"
                                  }`}
                                >
                                  <span
                                    className={`line-numbers px-4 text-xs ${
                                      line.content.startsWith("+")
                                        ? "bg-[#D8FFCB]"
                                        : line.content.startsWith("-")
                                        ? "bg-[#FFE4E9]"
                                        : "bg-white"
                                    }`}
                                  >
                                    {line.baseLineNumber || "  "}
                                  </span>
                                  <span
                                    className={`line-numbers px-4 text-xs ${
                                      line.content.startsWith("+")
                                        ? "bg-[#D8FFCB]"
                                        : line.content.startsWith("-")
                                        ? "bg-[#FFE4E9]"
                                        : "bg-[#F8FBFF]"
                                    }`}
                                  >
                                    {line.headLineNumber || "  "}
                                  </span>
                                  <span className="content">{line.content}</span>
                                </pre>
                              ))}
                          </div>
                        </div>
                      ))}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      )}
    </div>
  );
}
