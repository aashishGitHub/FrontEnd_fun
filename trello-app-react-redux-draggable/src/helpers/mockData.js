import { randomId } from './utils';

const getCard = content => ({
  id: randomId(),
  content
});

export default [
  { id: randomId(),
    name: 'To do',
    cards: [
      getCard(
        "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Create user stories and tasks<br><b>Deadline: 31/10/2023</b>"
        ),
      getCard(
        "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan the components and assign them to developers<br><b>Deadline: 31/10/2023</b>"
        ),
      getCard(
        "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan unit tests<br><b>Deadline: 31/10/2023</b>"
        ),
      getCard(
        "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>plan automation tests<br><b>Deadline: 31/10/2023</b>"
        ),
    ] },
  { id: randomId(),
    name: 'In progress',
    cards: [
      getCard(
        "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Write mock data for test<br><b>Deadline: 31/10/2023</b>"
        ),
      getCard(
        "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Review design<br><b>Deadline: 31/10/2023</b>"
        ),
      getCard(
        "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan the timeline<br><b>Deadline:</b> 31/10/2023"
        ),
    ] },
  {
    id: randomId(),
    name: 'Ready for test',
    cards: [
      getCard("<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Implement use cases<br><b>Deadline:</b> 31/10/2023"
        ),
      getCard("<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Design API<br><b>Deadline:</b> 31/10/2023"),
    ]
  },
  { id: randomId(),
    name: 'Done',
    cards: [
      getCard("<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Design database model<br><b>Deadline:</b> 31/10/2023"),
      getCard('Create models'),
    ] },
];
