"""
ValetDesk Backend API
A simple Flask REST API for managing parking tickets.
"""

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from datetime import datetime
import uuid
from typing import List, Dict, Union, Any, Optional

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native app

# Type alias for Item
Item = Dict[str, str]

# In-memory data store
items: List[Item] = [
    {
        "id": "1",
        "title": "Ticket #001 - Blue Honda Civic",
        "description": "Parked at Slot A1, Level 2",
        "vehicle_number": "MH12AB1234",
        "slot": "A1",
        "level": "2",
        "entry_time": "2026-01-31T10:00:00",
        "status": "active"
    },
    {
        "id": "2",
        "title": "Ticket #002 - White Toyota Camry",
        "description": "Parked at Slot B3, Level 1",
        "vehicle_number": "MH14CD5678",
        "slot": "B3",
        "level": "1",
        "entry_time": "2026-01-31T11:30:00",
        "status": "active"
    },
    {
        "id": "3",
        "title": "Ticket #003 - Red Maruti Swift",
        "description": "Parked at Slot C5, Level 3",
        "vehicle_number": "MH01EF9012",
        "slot": "C5",
        "level": "3",
        "entry_time": "2026-01-31T09:15:00",
        "status": "completed"
    }
]


@app.route('/items', methods=['GET'])
def get_items() -> tuple[Response, int]:
    """Get all parking tickets"""
    return jsonify({
        "success": True,
        "data": items,
        "count": len(items)
    }), 200


@app.route('/items/<item_id>', methods=['GET'])
def get_item(item_id: str) -> tuple[Response, int]:
    """Get a specific parking ticket by ID"""
    item = next((item for item in items if item["id"] == item_id), None)
    
    if item is None:
        return jsonify({
            "success": False,
            "error": "Item not found"
        }), 404
    
    return jsonify({
        "success": True,
        "data": item
    }), 200


@app.route('/items', methods=['POST'])
def create_item() -> tuple[Response, int]:
    """Create a new parking ticket"""
    data: Optional[Dict[str, Any]] = request.get_json()
    
    # Basic validation
    if not data:
        return jsonify({
            "success": False,
            "error": "No data provided"
        }), 400
    
    if not data.get('title'):
        return jsonify({
            "success": False,
            "error": "Title is required"
        }), 400
    
    # Create new item
    new_item: Item = {
        "id": str(uuid.uuid4())[:8],
        "title": str(data.get('title')),
        "description": str(data.get('description', '')),
        "vehicle_number": str(data.get('vehicle_number', '')),
        "slot": str(data.get('slot', '')),
        "level": str(data.get('level', '')),
        "entry_time": datetime.now().isoformat(),
        "status": "active"
    }
    
    items.append(new_item)
    
    return jsonify({
        "success": True,
        "message": "Parking ticket created successfully",
        "data": new_item
    }), 201


@app.route('/items/<item_id>', methods=['DELETE'])
def delete_item(item_id: str) -> tuple[Response, int]:
    """Delete a parking ticket"""
    global items
    initial_count = len(items)
    items = [item for item in items if item['id'] != item_id]
    
    if len(items) == initial_count:
        return jsonify({
            "success": False,
            "error": "Item not found"
        }), 404

    return jsonify({
        "success": True,
        "message": "Item deleted successfully"
    }), 200


@app.route('/items/<item_id>', methods=['PATCH'])
def update_item_status(item_id: str) -> tuple[Response, int]:
    """Update item status (e.g., mark as completed)"""
    data = request.get_json()
    status = data.get('status')
    
    if not status:
         return jsonify({
            "success": False,
            "error": "Status is required"
        }), 400

    item = next((item for item in items if item["id"] == item_id), None)
    
    if item is None:
        return jsonify({
            "success": False,
            "error": "Item not found"
        }), 404
        
    item['status'] = status
    
    return jsonify({
        "success": True,
        "message": "Item updated successfully",
        "data": item
    }), 200


@app.route('/health', methods=['GET'])
def health_check() -> tuple[Response, int]:
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "ValetDesk API"
    }), 200


if __name__ == '__main__':
    print("Starting ValetDesk API Server...")
    print("Endpoints:")
    print("  GET    /items          - List all parking tickets")
    print("  GET    /items/<id>     - Get specific ticket")
    print("  POST   /items          - Create new ticket")
    print("  DELETE /items/<id>     - Delete ticket")
    print("  PATCH  /items/<id>     - Update ticket status")
    print("  GET    /health         - Health check")
    app.run(host='0.0.0.0', port=5000, debug=True)
