import { CheckCircle, Circle, RefreshCw } from "lucide-react";

interface ProgressStageProps {
  stages: string[];
  currentStage: number;
  completed: boolean;
}

export function ProgressStages({
  stages,
  currentStage,
  completed,
}: ProgressStageProps) {
  return (
    <div className="flex items-center justify-between w-full my-6">
      {stages.map((stage, index) => (
        <div key={index} className="flex flex-col items-center relative">
          {/* Connector line */}
          {index < stages.length - 1 && (
            <div
              className={`absolute h-[2px] w-full top-3 left-1/2 -z-10 transition-colors duration-500 ${
                index < currentStage ? "bg-blue-600" : "bg-gray-200"
              }`}
              style={{ width: "calc(100% - 1.5rem)" }}
            ></div>
          )}

          {/* Stage indicator */}
          <div className="z-10 flex items-center justify-center">
            {index < currentStage ? (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            ) : index === currentStage ? (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                {completed ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-white animate-spin" />
                )}
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                <Circle className="h-4 w-4 text-gray-300" />
              </div>
            )}
          </div>

          {/* Stage name */}
          <span
            className={`text-xs mt-2 font-medium ${
              index <= currentStage ? "text-blue-700" : "text-gray-400"
            }`}
          >
            {stage}
          </span>
        </div>
      ))}
    </div>
  );
}
