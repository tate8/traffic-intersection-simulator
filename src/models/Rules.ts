type ConflictMatrixEntry = {
  default: string[];
  options: string[][];
};

type RulesMatrix = Record<string, ConflictMatrixEntry>;

/**
 * The rules matrix determines what traffic light configuration can be
 * executed given one sensor that is on
 * If the given sensor is the only active sensor, a default configuration
 * can be specified.
 */
export const rulesMatrix: RulesMatrix = {
  north_straight: {
    default: ["south_straight"],
    options: [["north_left"]],
  },
  north_left: {
    default: ["south_left"],
    options: [["north_straight"]],
  },
  south_straight: {
    default: ["north_straight"],
    options: [["south_left"]],
  },
  south_left: {
    default: ["north_left"],
    options: [["south_straight"]],
  },
  east_straight: {
    default: ["west_straight"],
    options: [["east_left"]],
  },
  east_left: {
    default: ["west_left"],
    options: [["east_straight"]],
  },
  west_straight: {
    default: ["east_straight"],
    options: [["west_left"]],
  },
  west_left: {
    default: ["east_left"],
    options: [["west_straight"]],
  },
  pedestrian: {
    default: [],
    options: [],
  },
};