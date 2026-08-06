import DashboardLayout from "../../layout/DashboardLayout";

import { useParams } from "react-router-dom";

import { useGenerateQuiz } from "../../hooks/useGenerateQuiz";

import { useEffect } from "react";

export default function Quiz() {

  const { lessonId } = useParams();

  const quizMutation = useGenerateQuiz();

  useEffect(() => {

    quizMutation.mutate(lessonId);

  }, []);

  if (quizMutation.isPending) {
    return (
      <DashboardLayout>
        Loading Quiz...
      </DashboardLayout>
    );
  }

  if (quizMutation.isError) {
    return (
      <DashboardLayout>
        Failed to load quiz.
      </DashboardLayout>
    );
  }

  const quiz = quizMutation.data?.quiz;

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold text-white">

        Lesson Quiz

      </h1>

    </DashboardLayout>
  );
}