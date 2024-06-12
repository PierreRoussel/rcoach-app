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

export const getNbSerieSucceeded = (logs: any[]) => {
  return logs.filter((log: any) => !log.is_failed).length;
};

export const getRpe = (logs: any[], seanceIndex: number) => {
  const exoLogs = logs[seanceIndex - 1];
  return exoLogs[exoLogs.length - 1]?.rpe || 'perfect';
};

export const buildLogs = (logs: any, seanceId: string) => {
  const groupedLogs: any[] = groupByExercice(
    logs,
    getNumberOfExerciceInLogs(logs)
  );
  const exoLogs: any[] = [];

  for (let index = 0; index < groupedLogs.length; index++) {
    if (groupedLogs[index].length) {
      exoLogs.push({
        'exercice': groupedLogs[index][0].exoId,
        'seanceExo': groupedLogs[index][0].seanceExoId,
        'seanceUtilisateur': seanceId,
        'repetitionsParSeries': groupedLogs[index].map(
          (serie: any) => serie.reps
        ),
        'rpe':
          groupedLogs[index][groupedLogs[index].length - 1].rpe || 'perfect',
      });
    }
  }
  return exoLogs;
};

export const getNumberOfExerciceInLogs = (logs: any) => {
  let exos: number[] = [];
  for (const iterator of logs) {
    if (!exos.includes(iterator.exoId)) exos.push(iterator.exoId);
  }
  return exos.length;
};
