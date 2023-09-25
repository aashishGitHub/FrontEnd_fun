import { render, screen } from '@testing-library/react';
import Header from './Header';
import { BrowserRouter as Router, } from 'react-router-dom';
describe('Header', () => {
    describe("Should load the header", () => {

        it("header should have a logo image", () => {
            const { container } = render(
                <>
                    <Router>
                        <Header></Header>
                    </Router>
                </>
            )
            expect(container).toBeDefined();
            expect(screen.queryAllByAltText("Trello logo")).toBeDefined();
            expect(screen.findByAltText("Trello logo")).toBeDefined();
        });
        it("header should have a link on the logo", () => {
            const { container } = render(
                <>
                    <Router>
                        <Header></Header>
                    </Router>
                </>
            )
            expect(screen.getByRole('link', { name: 'Trello logo' })).toBeDefined();
        });
    })
});
