export interface ScheduledTask {
    id?: number;
    name: string;
    mailDistributionList: string;
    scm: {
        sourcepath: string;
        targetBranch: string;
        branches?: any;
    };
    frequency: string;
    customPrefix: string;
    customSuffix: string;
}
