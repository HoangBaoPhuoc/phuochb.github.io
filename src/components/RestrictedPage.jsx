import React, { useEffect, useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { getStoredToken, API_BASE_URL } from "../auth/authUtils";

const GAME_IMAGES = [
  "/images/game-1.jpg",
  "/images/game-2.jpg",
  "/images/game-3.jpg",
  "/images/game-4.jpg",
  "/images/game-5.jpg",
  "/images/game-6.jpg",
];

const FADE_DURATION_MS = 900;

function shuffleCards(images) {
  const pairedCards = images
    .flatMap((image, pairIndex) => [
      { id: `${pairIndex}-a`, image, isMatched: false },
      { id: `${pairIndex}-b`, image, isMatched: false },
    ])
    .map((card) => ({ ...card, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ sortKey, ...card }) => card);

  return pairedCards;
}

export default function RestrictedPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Content from MongoDB
  const [contentData, setContentData] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  // Fallback defaults while loading
  const intro = contentData?.intro || {
    title: "",
    subtitle: "",
    description: "",
    buttonText: "Start game",
  };
  const game = contentData?.game || {
    title: "",
    subtitle: "",
    movesLabel: "Moves:",
    backButtonText: "Back",
  };
  const victory = contentData?.victory || {
    heading: "",
    subheading: "",
  };
  const victoryModal = contentData?.victoryModal || {
    title: "",
    text: "",
    buttonText: "",
  };

  const [activeView, setActiveView] = useState("intro");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [pendingView, setPendingView] = useState(null);
  const [cards, setCards] = useState(() => shuffleCards(GAME_IMAGES));
  const [openedCardIds, setOpenedCardIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isCheckingPair, setIsCheckingPair] = useState(false);
  const [typedIntroTitle, setTypedIntroTitle] = useState("");
  const [typedIntroSubtitle, setTypedIntroSubtitle] = useState("");
  const [typedIntroDescription, setTypedIntroDescription] = useState("");
  const [typedGameTitle, setTypedGameTitle] = useState("");
  const [typedGameSubtitle, setTypedGameSubtitle] = useState("");
  const [typedFlowersHeading, setTypedFlowersHeading] = useState("");
  const [typedFlowersSubheading, setTypedFlowersSubheading] = useState("");
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);

  // Letter content from MongoDB
  const [letterData, setLetterData] = useState(null);
  const [isLoadingLetter, setIsLoadingLetter] = useState(false);
  const [typedLetterTitle, setTypedLetterTitle] = useState("");
  const [typedLetterGreeting, setTypedLetterGreeting] = useState("");
  const [typedLetterParagraphs, setTypedLetterParagraphs] = useState([]);
  const [typedLetterSignature, setTypedLetterSignature] = useState("");

  const cardMap = useMemo(() => {
    const map = new Map();
    cards.forEach((card) => map.set(card.id, card));
    return map;
  }, [cards]);
  // Preload all game images on component mount
  useEffect(() => {
    // Preload game card images
    [...GAME_IMAGES, "/images/flowers.png", "/images/letter.png"].forEach(
      (imageSrc) => {
        const img = new Image();
        img.src = imageSrc;
      },
    );
  }, []);

  // Fetch content on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content`);
        if (response.ok) {
          const data = await response.json();
          setContentData(data);
        } else {
          console.error("Failed to fetch content:", response.status);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchContent();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const resetGame = () => {
    setCards(shuffleCards(GAME_IMAGES));
    setOpenedCardIds([]);
    setMoves(0);
    setIsCheckingPair(false);
    setIsVictoryModalOpen(false);
  };

  const transitionToView = (nextView) => {
    if (nextView === activeView || pendingView) return;

    if (nextView === "game") {
      resetGame();
    }

    setPendingView(nextView);
    setIsFadingOut(true);
  };

  const handleStartGame = () => {
    transitionToView("game");
  };

  const handleLetterClick = async () => {
    console.log("📬 Letter click - Opening modal");

    const token = getStoredToken();

    if (!token) {
      console.error("❌ No token found in localStorage");
      alert(
        "Your session has expired or you are not logged in.\n\nYou will be redirected to login page.",
      );
      logout();
      navigate("/");
      return;
    }

    setIsLetterOpen(true);
    setIsLoadingLetter(true);

    try {
      console.log("🔑 Token:", token.substring(0, 20) + "...");

      const response = await fetch(`${API_BASE_URL}/api/letter`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (response.status === 401) {
        // Token invalid or expired - logout and redirect
        console.error("❌ Token invalid - logging out");
        alert("Your session has expired. Please login again.");
        logout();
        navigate("/");
        return;
      }

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `HTTP ${response.status}`;
        } catch {
          errorMessage = await response.text();
        }
        console.error("❌ API Error:", errorMessage);
        throw new Error(`Failed to fetch letter: ${errorMessage}`);
      }

      const data = await response.json();
      console.log("✅ Letter data received:", data);
      console.log("✅ Setting letterData state...");
      setLetterData(data);
      console.log("✅ Modal should now show content");
    } catch (error) {
      console.error("❌ Error loading letter:", error);
      setIsLetterOpen(false);

      alert(
        `Failed to load letter:\n${error.message}\n\nPlease make sure:\n1. Server is running on port 4000\n2. Letter is seeded in database`,
      );
    } finally {
      console.log("🏁 Finished loading, isLoadingLetter = false");
      setIsLoadingLetter(false);
    }
  };

  const handleLetterClose = () => {
    setIsLetterOpen(false);
    // Reset typed text when closing
    setLetterData(null);
    setTypedLetterTitle("");
    setTypedLetterGreeting("");
    setTypedLetterParagraphs([]);
    setTypedLetterSignature("");
  };

  const handleCardClick = (cardId) => {
    if (isCheckingPair) return;

    const selectedCard = cardMap.get(cardId);
    if (
      !selectedCard ||
      selectedCard.isMatched ||
      openedCardIds.includes(cardId)
    ) {
      return;
    }

    if (openedCardIds.length >= 2) return;

    setOpenedCardIds((prev) => [...prev, cardId]);
  };

  useEffect(() => {
    if (openedCardIds.length !== 2) return;

    const [firstId, secondId] = openedCardIds;
    const firstCard = cardMap.get(firstId);
    const secondCard = cardMap.get(secondId);

    if (!firstCard || !secondCard) {
      setOpenedCardIds([]);
      setIsCheckingPair(false);
      return;
    }

    setIsCheckingPair(true);

    if (firstCard.image === secondCard.image) {
      const timer = setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card,
          ),
        );
        setMoves((prevMoves) => prevMoves + 1);
        setOpenedCardIds([]);
        setIsCheckingPair(false);
      }, 250);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setOpenedCardIds([]);
      setIsCheckingPair(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [openedCardIds, cardMap]);

  useEffect(() => {
    if (!isFadingOut || !pendingView) return;

    const timer = setTimeout(() => {
      setActiveView(pendingView);
      setPendingView(null);
      setIsFadingOut(false);
    }, FADE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isFadingOut, pendingView]);

  useEffect(() => {
    if (activeView !== "intro" || isFadingOut) {
      setTypedIntroTitle("");
      setTypedIntroSubtitle("");
      setTypedIntroDescription("");
      return;
    }

    let titleIndex = 0;
    let subtitleIndex = 0;
    let descriptionIndex = 0;
    let titleTimer;
    let subtitleTimer;
    let descriptionTimer;
    const timeoutIds = [];

    setTypedIntroTitle("");
    setTypedIntroSubtitle("");
    setTypedIntroDescription("");

    const startDescriptionTyping = () => {
      descriptionTimer = setInterval(() => {
        descriptionIndex += 1;
        setTypedIntroDescription(intro.description.slice(0, descriptionIndex));

        if (descriptionIndex >= intro.description.length) {
          clearInterval(descriptionTimer);
        }
      }, 30);
    };

    const startSubtitleTyping = () => {
      subtitleTimer = setInterval(() => {
        subtitleIndex += 1;
        setTypedIntroSubtitle(intro.subtitle.slice(0, subtitleIndex));

        if (subtitleIndex >= intro.subtitle.length) {
          clearInterval(subtitleTimer);
          timeoutIds.push(setTimeout(startDescriptionTyping, 180));
        }
      }, 45);
    };

    titleTimer = setInterval(() => {
      titleIndex += 1;
      setTypedIntroTitle(intro.title.slice(0, titleIndex));

      if (titleIndex >= intro.title.length) {
        clearInterval(titleTimer);
        timeoutIds.push(setTimeout(startSubtitleTyping, 220));
      }
    }, 55);

    return () => {
      clearInterval(titleTimer);
      clearInterval(subtitleTimer);
      clearInterval(descriptionTimer);
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [activeView, isFadingOut, intro]);

  useEffect(() => {
    if (activeView !== "game" || isFadingOut) {
      setTypedGameTitle("");
      setTypedGameSubtitle("");
      return;
    }

    let titleIndex = 0;
    let subtitleIndex = 0;
    let titleTimer;
    let subtitleTimer;
    const timeoutIds = [];

    setTypedGameTitle("");
    setTypedGameSubtitle("");

    const startSubtitleTyping = () => {
      subtitleTimer = setInterval(() => {
        subtitleIndex += 1;
        setTypedGameSubtitle(game.subtitle.slice(0, subtitleIndex));

        if (subtitleIndex >= game.subtitle.length) {
          clearInterval(subtitleTimer);
        }
      }, 35);
    };

    titleTimer = setInterval(() => {
      titleIndex += 1;
      setTypedGameTitle(game.title.slice(0, titleIndex));

      if (titleIndex >= game.title.length) {
        clearInterval(titleTimer);
        timeoutIds.push(setTimeout(startSubtitleTyping, 180));
      }
    }, 45);

    return () => {
      clearInterval(titleTimer);
      clearInterval(subtitleTimer);
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [activeView, isFadingOut, game]);

  useEffect(() => {
    if (activeView !== "victory" || isFadingOut) {
      setTypedFlowersHeading("");
      setTypedFlowersSubheading("");
      return;
    }

    let headingIndex = 0;
    let subheadingIndex = 0;
    let headingTimer;
    let subheadingTimer;
    const timeoutIds = [];

    setTypedFlowersHeading("");
    setTypedFlowersSubheading("");

    const startSubheadingTyping = () => {
      subheadingTimer = setInterval(() => {
        subheadingIndex += 1;
        setTypedFlowersSubheading(victory.subheading.slice(0, subheadingIndex));

        if (subheadingIndex >= victory.subheading.length) {
          clearInterval(subheadingTimer);
        }
      }, 55);
    };

    const startHeadingTyping = () => {
      headingTimer = setInterval(() => {
        headingIndex += 1;
        setTypedFlowersHeading(victory.heading.slice(0, headingIndex));

        if (headingIndex >= victory.heading.length) {
          clearInterval(headingTimer);
          timeoutIds.push(setTimeout(startSubheadingTyping, 260));
        }
      }, 85);
    };

    // Let flowers + letter appear first, then begin typing.
    timeoutIds.push(setTimeout(startHeadingTyping, 500));

    return () => {
      clearInterval(headingTimer);
      clearInterval(subheadingTimer);
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [activeView, isFadingOut, victory]);

  // Letter typing effect
  useEffect(() => {
    console.log("⌨️  Letter typing effect triggered", {
      letterData: !!letterData,
      isLetterOpen,
      isLoadingLetter,
    });

    if (!letterData || !isLetterOpen || isLoadingLetter) {
      console.log("⏸️  Typing paused - waiting for data");
      setTypedLetterTitle("");
      setTypedLetterGreeting("");
      setTypedLetterParagraphs([]);
      setTypedLetterSignature("");
      return;
    }

    console.log("▶️  Starting typing animation for:", letterData.title);

    let titleIndex = 0;
    let greetingIndex = 0;
    let paragraphIndex = 0;
    let currentParagraphCharIndex = 0;
    let signatureIndex = 0;

    let titleTimer;
    let greetingTimer;
    let paragraphTimer;
    let signatureTimer;
    const timeoutIds = [];

    setTypedLetterTitle("");
    setTypedLetterGreeting("");
    setTypedLetterParagraphs([]);
    setTypedLetterSignature("");

    // Step 4: Type signature
    const startSignatureTyping = () => {
      signatureTimer = setInterval(() => {
        signatureIndex += 1;
        setTypedLetterSignature(letterData.signature.slice(0, signatureIndex));

        if (signatureIndex >= letterData.signature.length) {
          clearInterval(signatureTimer);
        }
      }, 50);
    };

    // Step 3: Type all paragraphs sequentially
    const startParagraphTyping = () => {
      const typeNextChar = () => {
        if (paragraphIndex >= letterData.paragraphs.length) {
          // All paragraphs done, start signature
          timeoutIds.push(setTimeout(startSignatureTyping, 300));
          return;
        }

        const currentParagraphText = letterData.paragraphs[paragraphIndex];

        if (currentParagraphCharIndex < currentParagraphText.length) {
          // Continue typing current paragraph
          currentParagraphCharIndex += 1;
          const typedText = currentParagraphText.slice(
            0,
            currentParagraphCharIndex,
          );

          setTypedLetterParagraphs((prev) => {
            const newParagraphs = [...prev];
            newParagraphs[paragraphIndex] = typedText;
            return newParagraphs;
          });
        } else {
          // Current paragraph complete, move to next
          paragraphIndex += 1;
          currentParagraphCharIndex = 0;

          // Small delay between paragraphs
          clearInterval(paragraphTimer);
          timeoutIds.push(
            setTimeout(() => {
              paragraphTimer = setInterval(typeNextChar, 40);
            }, 200),
          );
          return;
        }
      };

      paragraphTimer = setInterval(typeNextChar, 40);
    };

    // Step 2: Type greeting
    const startGreetingTyping = () => {
      greetingTimer = setInterval(() => {
        greetingIndex += 1;
        setTypedLetterGreeting(letterData.greeting.slice(0, greetingIndex));

        if (greetingIndex >= letterData.greeting.length) {
          clearInterval(greetingTimer);
          timeoutIds.push(setTimeout(startParagraphTyping, 300));
        }
      }, 50);
    };

    // Step 1: Type title
    const startTitleTyping = () => {
      titleTimer = setInterval(() => {
        titleIndex += 1;
        setTypedLetterTitle(letterData.title.slice(0, titleIndex));

        if (titleIndex >= letterData.title.length) {
          clearInterval(titleTimer);
          timeoutIds.push(setTimeout(startGreetingTyping, 300));
        }
      }, 60);
    };

    // Start with small delay
    timeoutIds.push(setTimeout(startTitleTyping, 400));

    return () => {
      clearInterval(titleTimer);
      clearInterval(greetingTimer);
      clearInterval(paragraphTimer);
      clearInterval(signatureTimer);
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [letterData, isLetterOpen, isLoadingLetter]);

  const isCardOpen = (cardId) =>
    openedCardIds.includes(cardId) || cardMap.get(cardId)?.isMatched;

  // Check if all cards are matched
  useEffect(() => {
    if (activeView === "game" && cards.length > 0) {
      const allMatched = cards.every((card) => card.isMatched);
      if (allMatched && cards.some((card) => card.isMatched)) {
        const timer = setTimeout(() => {
          setIsVictoryModalOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [cards, activeView]);

  return (
    <div className="min-h-screen relative">
      <style>{`
        @keyframes caret-blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        .animate-caret-blink {
          animation: caret-blink 0.9s step-end infinite;
        }

        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes caret-blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-pulse-scale {
          animation: pulse-scale 1s ease-in-out infinite;
        }

        .animate-caret-blink {
          animation: caret-blink 0.9s step-end infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      <button
        onClick={handleLogout}
        className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition-colors duration-300 flex items-center gap-2"
        title="Logout"
      >
        <LogOut size={18} />
        Logout
      </button>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[min(94vw,900px)] min-h-[780px]">
          <div
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 text-center bg-white/35 backdrop-blur-lg p-8 md:p-12 rounded-xl shadow-[0_20px_60px_rgba(244,114,182,0.20)] transition-opacity duration-[900ms] ${
              activeView === "intro" && !isFadingOut
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <h1
              className="text-5xl font-extrabold mb-4 py-2 leading-normal bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent"
              style={{ textShadow: "0 6px 18px rgba(244, 114, 182, 0.35)" }}
            >
              {typedIntroTitle}
              {typedIntroTitle.length > 0 &&
              typedIntroTitle.length < intro.title.length ? (
                <span className="inline-block w-[0.08em] h-[0.85em] ml-2 align-[-0.02em] bg-pink-600 animate-caret-blink" />
              ) : null}
            </h1>

            <h2 className="text-2xl text-pink-700 mb-6">
              {typedIntroSubtitle}
              {typedIntroSubtitle.length > 0 &&
              typedIntroSubtitle.length < intro.subtitle.length ? (
                <span className="inline-block w-[0.08em] h-[0.85em] ml-1 align-[-0.04em] bg-pink-600 animate-caret-blink" />
              ) : null}
            </h2>

            <p className="text-sm text-pink-700 mb-8">
              {typedIntroDescription}
              {typedIntroDescription.length > 0 &&
              typedIntroDescription.length < intro.description.length ? (
                <span className="inline-block w-[0.08em] h-[0.85em] ml-1 align-[-0.04em] bg-pink-600 animate-caret-blink" />
              ) : null}
            </p>

            <button
              onClick={handleStartGame}
              className="px-10 py-3.5 rounded-full bg-gradient-to-r from-pink-700 to-pink-600 text-white font-bold shadow-[0_8px_24px_rgba(244,114,182,0.4)] transition-all duration-300 hover:from-pink-700 hover:to-pink-600 hover:scale-105 hover:shadow-[0_12px_32px_rgba(244,114,182,0.5)]"
            >
              Start game
            </button>
          </div>

          <div
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 text-center bg-white/50 backdrop-blur-lg p-10 md:p-14 rounded-xl shadow-[0_20px_60px_rgba(244,114,182,0.24)] transition-opacity duration-[900ms] ${
              activeView === "game" && !isFadingOut
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <h1
              className="text-3xl md:text-4xl font-extrabold leading-tight mb-2 bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent whitespace-pre-line"
              style={{ textShadow: "0 4px 14px rgba(244, 114, 182, 0.25)" }}
            >
              {typedGameTitle}
              {typedGameTitle.length > 0 &&
              typedGameTitle.length < game.title.length ? (
                <span className="inline-block w-[0.08em] h-[0.85em] ml-2 align-[-0.04em] bg-pink-600 animate-caret-blink" />
              ) : null}
            </h1>

            <p className="text-sm text-pink-800 font-semibold mb-3">
              {typedGameSubtitle}
              {typedGameSubtitle.length > 0 &&
              typedGameSubtitle.length < game.subtitle.length ? (
                <span className="inline-block w-[0.08em] h-[0.85em] ml-1 align-[-0.04em] bg-pink-600 animate-caret-blink" />
              ) : null}
            </p>
            <p className="text-sm text-pink-800 font-bold mb-5">
              Moves: {moves}
            </p>

            <div className="grid grid-cols-4 gap-y-6 gap-x-2 justify-items-center py-2 mb-6">
              {cards.map((card) => {
                const open = isCardOpen(card.id);

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isMatched || isCheckingPair}
                    className={`w-20 h-20 md:w-32 md:h-32 rounded-lg border border-pink-100 shadow-md transition-all duration-200 overflow-hidden ${
                      open
                        ? "bg-pink-50 scale-[1.02]"
                        : "bg-white hover:bg-pink-50 hover:scale-105"
                    } ${card.isMatched ? "scale-110 border-pink-400 ring-2 ring-pink-300 opacity-100" : "opacity-100"}`}
                  >
                    {open ? (
                      <img
                        src={card.image}
                        alt="memory card"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl md:text-4xl font-bold text-pink-800">
                        ?
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => transitionToView("intro")}
                className="px-7 py-2.5 rounded-full border border-pink-400 text-pink-700 font-bold bg-white/85 transition-all duration-300 hover:scale-105 hover:bg-pink-50"
              >
                Back
              </button>
            </div>
          </div>

          <div
            className={`fixed inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-[900ms] ${
              activeView === "victory" && !isFadingOut
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <h1 className="font-playfair text-[5.5rem] md:text-[8.5rem] leading-[1.15] pb-2 mb-4 px-4 md:px-8 max-w-[95vw] bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent">
              {typedFlowersHeading}
              {typedFlowersHeading.length > 0 &&
              typedFlowersHeading.length < victory.heading.length ? (
                <span className="inline-block w-[0.08em] h-[0.85em] ml-2 align-[-0.06em] bg-pink-600 animate-caret-blink" />
              ) : null}
            </h1>

            <h2 className="text-2xl text-pink-700 font-semibold mb-8">
              {typedFlowersSubheading}
              {typedFlowersSubheading.length > 0 &&
              typedFlowersSubheading.length < victory.subheading.length ? (
                <span className="inline-block w-[0.08em] h-[0.85em] ml-1 align-[-0.04em] bg-pink-600 animate-caret-blink" />
              ) : null}
            </h2>

            <div className="relative w-[32rem] h-[32rem] flex items-center justify-center">
              <img
                src="/images/flowers.png"
                alt="flowers"
                className="w-[32rem] h-[32rem] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              />
              <img
                src="/images/letter.png"
                alt="letter"
                onClick={handleLetterClick}
                className="absolute w-20 h-20 object-contain cursor-pointer hover:scale-125 transition-transform duration-300 bottom-[11rem] right-[9.5rem] animate-pulse-scale"
              />
            </div>
          </div>

          {isVictoryModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 md:p-12 max-w-lg w-[90vw] text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent">
                  {victoryModal.title}
                </h2>
                <p className="text-xl text-gray-700 mb-3">
                  {victoryModal.text}
                </p>

                <button
                  onClick={() => {
                    setIsVictoryModalOpen(false);
                    transitionToView("victory");
                  }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-700 to-pink-600 text-white font-bold shadow-lg hover:scale-105 transition-all duration-300"
                >
                  {victoryModal.buttonText}
                </button>
              </div>
            </div>
          )}

          {isLetterOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={handleLetterClose}
            >
              <div
                className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 md:p-16 max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleLetterClose}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors duration-200"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="prose prose-pink max-w-none font-be-vietnam pb-8">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-12 leading-normal py-2 bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent">
                    {typedLetterTitle}
                    {typedLetterTitle.length > 0 &&
                    letterData &&
                    typedLetterTitle.length < letterData.title.length ? (
                      <span className="inline-block w-[0.05em] h-[0.85em] ml-2 align-[-0.08em] bg-pink-600 animate-caret-blink" />
                    ) : null}
                  </h2>

                  {isLoadingLetter ? (
                    <div className="text-center text-gray-500 py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                      <p className="mt-2">Loading letter...</p>
                    </div>
                  ) : (
                    <div className="text-gray-700 leading-relaxed space-y-6 text-lg">
                      <p className="text-xl font-medium">
                        {typedLetterGreeting}
                        {typedLetterGreeting.length > 0 &&
                        letterData &&
                        typedLetterGreeting.length <
                          letterData.greeting.length ? (
                          <span className="inline-block w-[2px] h-[1.2em] ml-1 align-[-0.15em] bg-gray-700 animate-caret-blink" />
                        ) : null}
                      </p>

                      {typedLetterParagraphs.map((paragraph, index) => (
                        <p key={index} className="text-lg leading-8">
                          {paragraph}
                          {letterData &&
                          index === typedLetterParagraphs.length - 1 &&
                          paragraph.length <
                            letterData.paragraphs[index]?.length ? (
                            <span className="inline-block w-[2px] h-[1.2em] ml-1 align-[-0.15em] bg-gray-700 animate-caret-blink" />
                          ) : null}
                        </p>
                      ))}

                      {typedLetterSignature &&
                        letterData &&
                        typedLetterParagraphs.length ===
                          letterData.paragraphs.length &&
                        typedLetterParagraphs[typedLetterParagraphs.length - 1]
                          ?.length ===
                          letterData.paragraphs[
                            letterData.paragraphs.length - 1
                          ]?.length && (
                          <p className="text-right font-medium text-xl mt-10 whitespace-pre-line">
                            {typedLetterSignature}
                            {typedLetterSignature.length <
                            letterData.signature.length ? (
                              <span className="inline-block w-[2px] h-[1.2em] ml-1 align-[-0.15em] bg-gray-700 animate-caret-blink" />
                            ) : null}
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
