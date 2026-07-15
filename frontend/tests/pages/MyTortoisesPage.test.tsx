import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  deleteTortoise,
  getTortoises,
} from "../../src/services/tortoiseService";
import type { TortoiseResponse } from "../../src/types/tortoise";

import MyTortoisesPage from "../../src/pages/MyTortoisesPage/MyTortoisesPage";

vi.mock("../../src/services/tortoiseService", () => ({
  getTortoises: vi.fn(),
  deleteTortoise: vi.fn(),
}));

const mockedGetTortoises = vi.mocked(getTortoises);
const mockedDeleteTortoise = vi.mocked(deleteTortoise);

const mochi: TortoiseResponse = {
  tortoiseId: 1,
  name: "Mochi",
  ageMonths: 48,
  weightGrams: 680,
  photoUrl: "/uploads/tortoises/1/mochi.png",
  notes: "Loves dandelion leaves.",
  createdAt: "2026-07-15T10:00:00Z",
};

const rocky: TortoiseResponse = {
  tortoiseId: 2,
  name: "Rocky",
  ageMonths: 24,
  weightGrams: 410,
  photoUrl: null,
  notes: null,
  createdAt: "2026-07-14T10:00:00Z",
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/tortoises"]}>
      <MyTortoisesPage />
    </MemoryRouter>,
  );
}

describe("MyTortoisesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading cards while tortoises are loading", () => {
    mockedGetTortoises.mockReturnValue(
      new Promise(() => undefined),
    );

    renderPage();

    expect(
      screen.getByLabelText("Loading tortoises"),
    ).toBeInTheDocument();
  });

  it("displays the empty state when there are no tortoises", async () => {
    mockedGetTortoises.mockResolvedValue([]);

    renderPage();

    expect(
      await screen.findByRole("heading", {
        name: "Your shell family starts here",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /add my first tortoise/i,
      }),
    ).toBeInTheDocument();
  });

  it("displays tortoises returned by the service", async () => {
    mockedGetTortoises.mockResolvedValue([
      mochi,
      rocky,
    ]);

    renderPage();

    expect(
      await screen.findByRole("heading", {
        name: "Mochi",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Rocky",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("4 years old"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("2 years old"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("680 g"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("410 g"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Loves dandelion leaves."),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "No care notes yet. Add their favourite things.",
      ),
    ).toBeInTheDocument();
  });

  it("displays the number of tortoises", async () => {
    mockedGetTortoises.mockResolvedValue([
      mochi,
      rocky,
    ]);

    renderPage();

    expect(
      await screen.findByText(
        "2 tortoises in your family",
      ),
    ).toBeInTheDocument();
  });

  it("displays an error when loading fails", async () => {
    mockedGetTortoises.mockRejectedValue(
      new Error("Unable to connect to the server."),
    );

    renderPage();

    expect(
      await screen.findByText(
        "Unable to connect to the server.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /try again/i,
      }),
    ).toBeInTheDocument();
  });

  it("loads the tortoises again when retry is clicked", async () => {
    mockedGetTortoises
      .mockRejectedValueOnce(
        new Error("Unable to connect to the server."),
      )
      .mockResolvedValueOnce([]);

    const user = userEvent.setup();

    renderPage();

    expect(
      await screen.findByText(
        "Unable to connect to the server.",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /try again/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Your shell family starts here",
      }),
    ).toBeInTheDocument();

    expect(mockedGetTortoises).toHaveBeenCalledTimes(2);
  });

  it("opens a confirmation dialog before deletion", async () => {
    mockedGetTortoises.mockResolvedValue([mochi]);

    const user = userEvent.setup();

    renderPage();

    await screen.findByRole("heading", {
      name: "Mochi",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Delete Mochi",
      }),
    );

    expect(
      screen.getByRole("dialog"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Delete Mochi?"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /this action cannot be undone/i,
      ),
    ).toBeInTheDocument();

    expect(mockedDeleteTortoise).not.toHaveBeenCalled();
  });

  it("does not delete when the confirmation dialog is cancelled", async () => {
    mockedGetTortoises.mockResolvedValue([mochi]);

    const user = userEvent.setup();

    renderPage();

    await screen.findByRole("heading", {
      name: "Mochi",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Delete Mochi",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Keep tortoise",
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog"),
      ).not.toBeInTheDocument();
    });

    expect(mockedDeleteTortoise).not.toHaveBeenCalled();

    expect(
      screen.getByRole("heading", {
        name: "Mochi",
      }),
    ).toBeInTheDocument();
  });

  it("deletes the selected tortoise after confirmation", async () => {
    mockedGetTortoises.mockResolvedValue([mochi]);
    mockedDeleteTortoise.mockResolvedValue(undefined);

    const user = userEvent.setup();

    renderPage();

    await screen.findByRole("heading", {
      name: "Mochi",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Delete Mochi",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete",
      }),
    );

    await waitFor(() => {
      expect(mockedDeleteTortoise).toHaveBeenCalledWith(1);
    });

    expect(
      await screen.findByRole("heading", {
        name: "Your shell family starts here",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Mochi was deleted."),
    ).toBeInTheDocument();
  });

    it("keeps the tortoise when deletion fails", async () => {
    mockedGetTortoises.mockResolvedValue([mochi]);

    mockedDeleteTortoise.mockRejectedValue(
        new Error("Unable to delete Mochi."),
    );

    const user = userEvent.setup();

    renderPage();

    await screen.findByRole("heading", {
        name: "Mochi",
    });

    await user.click(
        screen.getByRole("button", {
        name: "Delete Mochi",
        }),
    );

    await user.click(
        screen.getByRole("button", {
        name: "Delete",
        }),
    );

    expect(
        await screen.findByText("Unable to delete Mochi."),
    ).toBeInTheDocument();

    expect(
        screen.getByRole("dialog", {
        name: "Delete Mochi?",
        }),
    ).toBeInTheDocument();

    expect(mockedDeleteTortoise).toHaveBeenCalledWith(1);

    await user.click(
        screen.getByRole("button", {
        name: "Keep tortoise",
        }),
    );

    await waitFor(() => {
        expect(
        screen.queryByRole("dialog"),
        ).not.toBeInTheDocument();
    });

    expect(
        screen.getByRole("heading", {
        name: "Mochi",
        }),
    ).toBeInTheDocument();
    });
});