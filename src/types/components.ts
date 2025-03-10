
import { Sprint } from "./index";

export interface SprintHeaderProps {
  sprint: Sprint;
  onStartSprint: () => void;
  onCompleteSprint: () => void;
}
