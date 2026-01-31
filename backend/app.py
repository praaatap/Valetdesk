"""
ValetDesk Backend API
A simple Flask REST API for managing tasks/tickets using SQLite.
"""

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from datetime import datetime
import uuid
import sqlite3
import os
from typing import List, Dict, Any, Optional

app = Flask(__name__)
CORS(app)

DB_NAME = "valetdesk.db"

def init_db():
    """Initialize the SQLite database"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            vehicle_number TEXT,
            slot TEXT,
            level TEXT,
            entry_time TEXT,
            status TEXT
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize DB on start
init_db()

@app.route('/items', methods=['GET'])
def get_items() -> tuple[Response, int]:
    """Get all items from DB"""
    try:
        conn = get_db_connection()
        items = conn.execute('SELECT * FROM items ORDER BY entry_time DESC').fetchall()
        conn.close()
        
        # Convert rows to dicts
        items_list = [dict(ix) for ix in items]
        
        return jsonify({
            "success": True,
            "data": items_list,
            "count": len(items_list)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/items/<item_id>', methods=['GET'])
def get_item(item_id: str) -> tuple[Response, int]:
    """Get item by ID from DB"""
    try:
        conn = get_db_connection()
        item = conn.execute('SELECT * FROM items WHERE id = ?', (item_id,)).fetchone()
        conn.close()
        
        if item is None:
            return jsonify({
                "success": False,
                "error": "Item not found"
            }), 404
        
        return jsonify({
            "success": True,
            "data": dict(item)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/items', methods=['POST'])
def create_item() -> tuple[Response, int]:
    """Create new item in DB"""
    data: Optional[Dict[str, Any]] = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({
            "success": False,
            "error": "Title is required"
        }), 400
    
    try:
        new_id = str(uuid.uuid4())[:8]
        entry_time = datetime.now().isoformat()
        
        conn = get_db_connection()
        conn.execute('''
            INSERT INTO items (id, title, description, vehicle_number, slot, level, entry_time, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            new_id,
            str(data.get('title')),
            str(data.get('description', '')),
            str(data.get('vehicle_number', '')),
            str(data.get('slot', '')),
            str(data.get('level', '')),
            entry_time,
            "active"
        ))
        conn.commit()
        conn.close()
        
        return jsonify({
            "success": True,
            "message": "Task created successfully",
            "data": { "id": new_id } # Simplification, client usually re-fetches
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/items/<item_id>', methods=['DELETE'])
def delete_item(item_id: str) -> tuple[Response, int]:
    """Delete item from DB"""
    try:
        conn = get_db_connection()
        result = conn.execute('DELETE FROM items WHERE id = ?', (item_id,))
        conn.commit()
        conn.close()
        
        if result.rowcount == 0:
            return jsonify({
                "success": False,
                "error": "Item not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Item deleted successfully"
        }), 200
    except Exception as e:
         return jsonify({"success": False, "error": str(e)}), 500


@app.route('/items/<item_id>', methods=['PATCH'])
def update_item_status(item_id: str) -> tuple[Response, int]:
    """Update item status in DB"""
    data = request.get_json()
    status = data.get('status')
    
    if not status:
         return jsonify({
            "success": False,
            "error": "Status is required"
        }), 400

    try:
        conn = get_db_connection()
        result = conn.execute('UPDATE items SET status = ? WHERE id = ?', (status, item_id))
        conn.commit()
        conn.close()
        
        if result.rowcount == 0:
            return jsonify({
                "success": False,
                "error": "Item not found"
            }), 404
            
        return jsonify({
            "success": True,
            "message": "Item updated successfully"
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check() -> tuple[Response, int]:
    return jsonify({
        "status": "healthy",
        "service": "ValetDesk API (SQLite)"
    }), 200


if __name__ == '__main__':
    print("Starting ValetDesk API Server (SQLite)...")
    app.run(host='0.0.0.0', port=5000, debug=True)
