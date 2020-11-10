import Command, { CategoryNames } from "..";

export default abstract class UtilityGroup extends Command {
  category: CategoryNames = "Utility";
}
