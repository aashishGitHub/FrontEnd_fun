type SupportPriority = 
{
    urgent: 'Urgent'
    high: 'High'
    normal: 'Normal'
    low: 'Low'
    none: 'None'
}


type Support_Priority = keyof  SupportPriority;

const SupportPriorityByLevel : Record<'P1'| 'P2'| 'P3'| 'P4'| 'P5', Support_Priority> = {
    P1: 'urgent', 
    P2: 'high',
    P3: 'normal', 
    P4: 'low',
    P5: 'none'
}

const valueByLevel = SupportPriorityByLevel.P1;
const valueByLevel2 = SupportPriorityByLevel.P3
