export class Distance {
    text: string;
    value: number;
}

export class Duration {
    text: string;
    value: number;
}

export class Element {
    distance: Distance;
    duration: Duration;
    status: string;
}

export class Row {
    elements: Element[];
}

export class GoogleMapsResponse {
    destination_addresses: string[];
    origin_addresses: string[];
    rows: Row[];
    status: string;
}
