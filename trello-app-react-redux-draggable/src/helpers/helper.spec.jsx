import { reOrderList, moveCardToList } from './boardHelper';

const list = JSON.parse('[{ "id": "v5pnmq6qyaj4bi6345xt22", "content": "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Review design<br><b>Deadline: 31/10/2023</b>" }, { "id": "v4k1dhsoprrcbqrd21k7wo", "content": "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan unit tests<br><b>Deadline: 31/10/2023</b>" }, { "id": "xkllq1j9wiq8j31rv0uk", "content": "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>plan automation tests<br><b>Deadline: 31/10/2023</b>" }]');
const result = JSON.parse('[{ "id": "v4k1dhsoprrcbqrd21k7wo", "content": "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan unit tests<br><b>Deadline: 31/10/2023</b>" }, { "id": "v5pnmq6qyaj4bi6345xt22", "content": "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Review design<br><b>Deadline: 31/10/2023</b>" }, { "id": "xkllq1j9wiq8j31rv0uk", "content": "<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>plan automation tests<br><b>Deadline: 31/10/2023</b>" }]');
describe('Helper tests', () => {
    describe("should be able to reorder cards in the list using reOrderList", () => {
        it("moving item at 1st index to position 0", () => {
            const startindex = 1, endIndex = 0;
            const reorderedList = reOrderList(list, startindex, endIndex);

            expect(reorderedList).toStrictEqual(result);
            expect(reorderedList.findIndex(item => item.id == 'v4k1dhsoprrcbqrd21k7wo')).toBe(endIndex);
        });
    });

    describe("should be able to move card to list using moveCardToList", () => {
        const sourceList = JSON.parse('[{"id":"v4k1dhsoprrcbqrd21k7wo","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan unit tests<br><b>Deadline: 31/10/2023</b>"},{"id":"v5pnmq6qyaj4bi6345xt22","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Review design<br><b>Deadline: 31/10/2023</b>"},{"id":"xkllq1j9wiq8j31rv0uk","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>plan automation tests<br><b>Deadline: 31/10/2023</b>"}]');
        const destList = JSON.parse('[{"id":"0b5s26knrb8hyuaxsrojoe","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Create user stories and tasks<br><b>Deadline: 31/10/2023</b>"},{"id":"1tkstlendmi55vps0hdo37","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Write mock data for test<br><b>Deadline: 31/10/2023</b>"},{"id":"tia4au03p6p66ty7yyzz5n","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan the components and assign them to developers<br><b>Deadline: 31/10/2023</b>"},{"id":"w6ukjxt9479pp41x8qujoi","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan the timeline<br><b>Deadline:</b> 31/10/2023"}]');

        const resSrcClone = JSON.parse('[{"id":"v4k1dhsoprrcbqrd21k7wo","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan unit tests<br><b>Deadline: 31/10/2023</b>"},{"id":"xkllq1j9wiq8j31rv0uk","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>plan automation tests<br><b>Deadline: 31/10/2023</b>"}]');
        const resDesClone = JSON.parse('[{"id":"0b5s26knrb8hyuaxsrojoe","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Create user stories and tasks<br><b>Deadline: 31/10/2023</b>"},{"id":"v5pnmq6qyaj4bi6345xt22","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Review design<br><b>Deadline: 31/10/2023</b>"},{"id":"1tkstlendmi55vps0hdo37","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Write mock data for test<br><b>Deadline: 31/10/2023</b>"},{"id":"tia4au03p6p66ty7yyzz5n","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan the components and assign them to developers<br><b>Deadline: 31/10/2023</b>"},{"id":"w6ukjxt9479pp41x8qujoi","content":"<b>Name:</b> Aashish<br><b>Description:&nbsp;</b>Plan the timeline<br><b>Deadline:</b> 31/10/2023"}]');

        it("should be able to move card from a list to 2nd list", () => {
            const resultantCardList = moveCardToList(sourceList, destList, 1, 1);
            expect(resultantCardList.newSourceList).toStrictEqual(resSrcClone);
            expect(resultantCardList.newDestinationList).toStrictEqual(resDesClone);
        });
    });
});
