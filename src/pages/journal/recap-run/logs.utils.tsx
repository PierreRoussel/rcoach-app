export const groupByExercice = (logs: any, nbOfExercices: number) => {
  const groupBy: any[][] = [];
  for (let index = 0; index < nbOfExercices; index++) {
    groupBy.push([]);
  }

  for (const exoLog of logs) {
    groupBy[exoLog.seanceIndex - 1].push(exoLog);
  }
  return groupBy;
};

export const getNbSerieSucceeded = (
  logs: any[],
  seanceIndex: number,
  nbRepsGoal: number
) => {
  return logs[seanceIndex - 1].filter((log: any) => !log.is_failed)
    .length;
};
