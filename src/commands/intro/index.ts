import Command, { CategoryNames } from "..";

export default abstract class IntroGroup extends Command {
  category: CategoryNames = "Intro";
}
