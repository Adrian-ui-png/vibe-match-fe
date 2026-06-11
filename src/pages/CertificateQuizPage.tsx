import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useVibeMatch } from '../context/VibeMatchContext';

const CERTIFICATE_QUESTIONS = {
  rizz: [
    {
      id: 1,
      questionText: "How do you react when they don't reply for 2 hours?",
      options: [
        { text: "Text again with a relatable meme", points: 3 },
        { text: "Post a high-aesthetic selfie to your story", points: 5 },
        { text: "Send a blunt '?' to show attitude", points: 1 },
        { text: "Stare at the chat and overthink", points: 2 }
      ]
    },
    {
      id: 2,
      questionText: "What is your go-to plan for a first date?",
      options: [
        { text: "Grab street chai and talk for hours", points: 4 },
        { text: "Book a premium cafe but split the bill", points: 2 },
        { text: "Go bowling or to an arcade zone", points: 5 },
        { text: "A formal dinner at a fine-dine restaurant", points: 3 }
      ]
    },
    {
      id: 3,
      questionText: "How do you respond to 'we need to talk'?",
      options: [
        { text: "Ask 'Sure, what happened?' (Panic mode)", points: 2 },
        { text: "Reply 'Who is this?' to establish dominance", points: 5 },
        { text: "Spam 'Did I do something wrong?'", points: 1 },
        { text: "Say 'Alright, tea time!' with a happy emoji", points: 4 }
      ]
    },
    {
      id: 4,
      questionText: "What is your typical texting speed?",
      options: [
        { text: "Instantly, the second they press send", points: 1 },
        { text: "Exactly 5-10 minutes, looking busy", points: 4 },
        { text: "Completely random - hours later", points: 5 },
        { text: "Only online after midnight", points: 3 }
      ]
    },
    {
      id: 5,
      questionText: "What is your signature opener?",
      options: [
        { text: "A cheesy pun customized to their name", points: 3 },
        { text: "A nerd developer joke or tech meme", points: 2 },
        { text: "Just reacting to their latest story naturally", points: 5 },
        { text: "A dry 'Hey' or 'How are you?'", points: 1 }
      ]
    }
  ],
  greenflag: [
    {
      id: 1,
      questionText: "When they vent about their ex, what do you do?",
      options: [
        { text: "Listen actively and validate their feelings", points: 5 },
        { text: "Say 'exes are trash' instantly to agree", points: 3 },
        { text: "Start complaining about your own ex", points: 1 },
        { text: "Give generic advice on how to move on", points: 2 }
      ]
    },
    {
      id: 2,
      questionText: "They say 'anything is fine' for food. You:",
      options: [
        { text: "Order their favorite momos + surprise dessert", points: 5 },
        { text: "Order only your own food to teach a lesson", points: 1 },
        { text: "Ask 20 follow-up questions until they choose", points: 2 },
        { text: "Pick the highest rated place in the area", points: 4 }
      ]
    },
    {
      id: 3,
      questionText: "They go to a party without inviting you. You:",
      options: [
        { text: "Wish them a fun night and do your own thing", points: 5 },
        { text: "Reply with passive-aggressive dry texts", points: 1 },
        { text: "Show up at the party uninvited to check on them", points: 0 },
        { text: "Inquire about the guest list repeatedly", points: 3 }
      ]
    },
    {
      id: 4,
      questionText: "Your text message threads generally consist of:",
      options: [
        { text: "Balanced messages with custom emojis", points: 5 },
        { text: "Repetitive one-word 'k' or 'hmm'", points: 1 },
        { text: "Long voice notes explaining everything", points: 3 },
        { text: "Spam double texts every few minutes", points: 2 }
      ]
    },
    {
      id: 5,
      questionText: "How well do you remember their small habits?",
      options: [
        { text: "Remember easily and reference them in chat", points: 5 },
        { text: "Remember but keep it to yourself", points: 3 },
        { text: "Forget their details half the time", points: 1 },
        { text: "Write them down in a private notes app", points: 2 }
      ]
    }
  ],
  audit: [
    {
      id: 1,
      questionText: "What does your Instagram bio look like?",
      options: [
        { text: "Link to your Spotify playlist + aesthetic emoji", points: 5 },
        { text: "Your college abbreviation + 'Simple soul'", points: 2 },
        { text: "Date of birth + 'Royal blood' style quote", points: 1 },
        { text: "Completely blank, clean and mysterious", points: 4 }
      ]
    },
    {
      id: 2,
      questionText: "How often do you post on your grid?",
      options: [
        { text: "Once or twice a year max", points: 5 },
        { text: "Once a week like a routine", points: 4 },
        { text: "Multiple dump posts every single day", points: 1 },
        { text: "My entire grid is archived, 0 posts", points: 3 }
      ]
    },
    {
      id: 3,
      questionText: "What's the status of your Story Highlights?",
      options: [
        { text: "Minimalist covers with matching typography", points: 5 },
        { text: "Random default photo covers", points: 3 },
        { text: "No cover photos, just raw story frames", points: 2 },
        { text: "I have no highlights at all", points: 4 }
      ]
    },
    {
      id: 4,
      questionText: "What do you post most on your stories?",
      options: [
        { text: "Late night aesthetic drives with slow songs", points: 5 },
        { text: "Sharing opinion posts on social issues", points: 2 },
        { text: "Mirror flash selfies in clean outfits", points: 4 },
        { text: "Meme reports and funny tweets continuously", points: 3 }
      ]
    },
    {
      id: 5,
      questionText: "What is your follower-to-following ratio?",
      options: [
        { text: "Equal ratio or following more people", points: 3 },
        { text: "2x more followers than following", points: 5 },
        { text: "Following less than 50 people, high followers", points: 4 },
        { text: "Private account with under 100 close friends", points: 4 }
      ]
    }
  ]
};

export const CertificateQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    certTestType,
    certQuestionIndex,
    setCertQuestionIndex,
    certAnswers,
    setCertAnswers,
    setCertScore
  } = useVibeMatch();

  const handleCertificateAnswer = (points: number) => {
    const newAnswers = [...certAnswers, points];
    setCertAnswers(newAnswers);

    if (certQuestionIndex < 4) {
      setCertQuestionIndex(certQuestionIndex + 1);
    } else {
      const totalPts = newAnswers.reduce((a, b) => a + b, 0);
      setCertScore(totalPts);
      navigate('/certificate');
    }
  };

  const currentQuestion = CERTIFICATE_QUESTIONS[certTestType][certQuestionIndex];

  return (
    <motion.div
      key="certificate-quiz"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
          {certTestType.toUpperCase()} AUDIT • QUESTION {certQuestionIndex + 1} OF 5
        </span>
        <h3 className="text-lg font-black text-white px-2">
          {currentQuestion.questionText}
        </h3>
      </div>
      <div className="space-y-3">
        {currentQuestion.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleCertificateAnswer(opt.points)}
            className="w-full text-left glass-panel glass-card-hover p-4 rounded-xl text-gray-200 hover:text-white border border-white/10 text-xs font-bold transition-all focus:outline-none cursor-pointer flex items-center justify-between"
          >
            <span>{opt.text}</span>
            <Heart size={12} className="text-gray-600 shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};
